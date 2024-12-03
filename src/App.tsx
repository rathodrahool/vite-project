// App.tsx
import { useState, useEffect } from "react";
import Toast from "./components/Toast";

function App() {
  const [showMoreSettings, setShowMoreSettings] = useState<boolean>(false);
  const [emails, setEmails] = useState<string[]>([]);

  // Unified toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Inputs for email generation
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");

  // Validation Functions
  const isValidName = (name: string): boolean => /^[A-Za-z'-]+$/.test(name);
  const isValidDomain = (domain: string): boolean =>
    /^[A-Za-z0-9-]+\.[A-Za-z]{2,}$/.test(domain);

  const generateEmails = (
    firstName: string,
    lastName: string,
    domain: string,
    nickname: string,
    middleName: string
  ): string[] => {
    if (!firstName || !lastName || !domain) return [];

    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastInitial = lastName.charAt(0).toLowerCase();
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerDomain = domain.toLowerCase();
    const lowerNickname = nickname.toLowerCase();
    const lowerMiddleName = middleName.toLowerCase();

    // Helper function for capitalization
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const patterns: (string | false)[] = [
      // Basic Patterns
      `${lowerFirstName}@${lowerDomain}`,
      `${lowerLastName}@${lowerDomain}`,
      `${lowerFirstName}${lowerLastName}@${lowerDomain}`,
      `${lowerFirstName}.${lowerLastName}@${lowerDomain}`,
      `${firstInitial}${lowerLastName}@${lowerDomain}`,
      `${firstInitial}.${lowerLastName}@${lowerDomain}`,
      `${lowerFirstName}${lastInitial}@${lowerDomain}`,
      `${lowerFirstName}.${lastInitial}@${lowerDomain}`,
      `${firstInitial}${lastInitial}@${lowerDomain}`,
      `${firstInitial}.${lastInitial}@${lowerDomain}`,

      // With Middle Name
      middleName && `${lowerFirstName}${lowerMiddleName}@${lowerDomain}`,
      middleName && `${lowerFirstName}.${lowerMiddleName}@${lowerDomain}`,
      middleName && `${firstInitial}${lowerMiddleName}@${lowerDomain}`,
      middleName && `${firstInitial}.${lowerMiddleName}@${lowerDomain}`,
      middleName &&
        `${lowerFirstName}${lowerMiddleName}${lowerLastName}@${lowerDomain}`,
      middleName &&
        `${lowerFirstName}.${lowerMiddleName}.${lowerLastName}@${lowerDomain}`,

      // With Nickname
      nickname && `${lowerNickname}@${lowerDomain}`,
      nickname && `${lowerNickname}.${lowerLastName}@${lowerDomain}`,
      nickname && `${lowerFirstName}.${lowerNickname}@${lowerDomain}`,
      nickname && `${lowerFirstName}${lowerNickname}@${lowerDomain}`,

      // With Hyphens
      `${lowerFirstName}-${lowerLastName}@${lowerDomain}`,
      `${firstInitial}-${lowerLastName}@${lowerDomain}`,
      `${lowerFirstName}-${lastInitial}@${lowerDomain}`,
      `${lowerLastName}-${lowerFirstName}@${lowerDomain}`,
      middleName && `${lowerFirstName}-${lowerMiddleName}@${lowerDomain}`,
      middleName &&
        `${lowerFirstName}-${lowerMiddleName}-${lowerLastName}@${lowerDomain}`,

      // With Underscores
      `${lowerFirstName}_${lowerLastName}@${lowerDomain}`,
      `${firstInitial}_${lowerLastName}@${lowerDomain}`,
      `${lowerFirstName}_${lastInitial}@${lowerDomain}`,
      `${lowerLastName}_${lowerFirstName}@${lowerDomain}`,
      middleName && `${lowerFirstName}_${lowerMiddleName}@${lowerDomain}`,
      middleName &&
        `${lowerFirstName}_${lowerMiddleName}_${lowerLastName}@${lowerDomain}`,

      // Reverse Order
      `${lowerLastName}${lowerFirstName}@${lowerDomain}`,
      `${lowerLastName}.${lowerFirstName}@${lowerDomain}`,
      `${lowerLastName}${firstInitial}@${lowerDomain}`,
      `${lowerLastName}.${firstInitial}@${lowerDomain}`,
      `${lastInitial}${lowerFirstName}@${lowerDomain}`,
      `${lastInitial}.${lowerFirstName}@${lowerDomain}`,

      // Full Name Variations
      `${capitalize(firstName)}.${capitalize(lastName)}@${lowerDomain}`,
      `${capitalize(firstName)}${capitalize(lastName)}@${lowerDomain}`,
      `${capitalize(firstName)}_${capitalize(lastName)}@${lowerDomain}`,
      `${capitalize(firstName)}-${capitalize(lastName)}@${lowerDomain}`,

      // Additional Patterns Using First and Last Initials
      `${firstInitial}${lastInitial}@${lowerDomain}`,
      `${firstInitial}.${lastInitial}@${lowerDomain}`,
      `${firstInitial}-${lastInitial}@${lowerDomain}`,
      `${firstInitial}_${lastInitial}@${lowerDomain}`,
    ];

    return [
      ...new Set(patterns.filter((pattern): pattern is string => !!pattern)),
    ];
  };

  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input Validation
    if (
      !isValidName(firstName) ||
      !isValidName(lastName) ||
      (middleName && !isValidName(middleName)) ||
      (nickname && !isValidName(nickname)) ||
      !isValidDomain(domain)
    ) {
      setToast({
        message:
          "Please enter valid names (letters, hyphens, apostrophes) and a valid domain.",
        type: "error",
      });
      return;
    }

    const newEmails = generateEmails(
      firstName,
      lastName,
      domain,
      nickname,
      middleName
    );
    setEmails(newEmails);
    localStorage.setItem("generatedEmails", JSON.stringify(newEmails)); // Store in local storage

    // Show success toast
    setToast({
      message: "Emails generated successfully!",
      type: "success",
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(emails.join("\n")).then(() => {
      setToast({
        message: "Emails copied to clipboard!",
        type: "success",
      });
      setTimeout(() => setToast(null), 2000);
    });
  };

  const composeGmailLink = (): string => {
    const bcc = emails.join(",");
    return `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(
      bcc
    )}`;
  };

  const generatedEmailsCount: number = emails.length;

  // Retrieve previously generated emails from localStorage on component mount
  useEffect(() => {
    const storedEmails = localStorage.getItem("generatedEmails");
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  }, []);

  // Automatically hide toast after 2 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center min-h-screen relative">
      {/* Render Toast if exists */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Free{" "}
          <span className="text-green-600 bg-green-100 px-2 py-1 rounded">
            Email Permutator
          </span>
        </h1>
        <p className="text-2xl text-gray-800 mt-2">to find the right email</p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center text-green-600">
            <i className="fas fa-check-circle"></i>
            <span className="ml-2 text-gray-600">
              Find email combinations in seconds
            </span>
          </div>
          <div className="flex items-center text-green-600">
            <i className="fas fa-check-circle"></i>
            <span className="ml-2 text-gray-600">Easy copy/paste</span>
          </div>
          <div className="flex items-center text-green-600">
            <i className="fas fa-check-circle"></i>
            <span className="ml-2 text-gray-600">100% Free</span>
          </div>
        </div>
        <div className="flex mt-8 space-x-8">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Email permutator
            </h2>
            <form onSubmit={handleGenerate}>
              <div className="mb-4 text-left">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-blue-600"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="e.g. Kevin"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full p-3 border ${
                    toast && toast.type === "error" && !isValidName(firstName)
                      ? "border-red-500"
                      : "border-blue-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    toast && toast.type === "error" && !isValidName(firstName)
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-blue-600"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full p-3 border ${
                    toast && toast.type === "error" && !isValidName(lastName)
                      ? "border-red-500"
                      : "border-blue-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    toast && toast.type === "error" && !isValidName(lastName)
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label
                  htmlFor="domain"
                  className="block text-sm font-medium text-blue-600"
                >
                  Domain
                </label>
                <input
                  id="domain"
                  type="text"
                  placeholder="e.g. google.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={`w-full p-3 border ${
                    toast && toast.type === "error" && !isValidDomain(domain)
                      ? "border-red-500"
                      : "border-blue-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    toast && toast.type === "error" && !isValidDomain(domain)
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>

              {showMoreSettings && (
                <>
                  <div className="mb-4 text-left">
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-blue-600"
                    >
                      Nickname
                    </label>
                    <input
                      id="nickname"
                      type="text"
                      placeholder="e.g. Kev"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className={`w-full p-3 border ${
                        toast &&
                        toast.type === "error" &&
                        nickname &&
                        !isValidName(nickname)
                          ? "border-red-500"
                          : "border-blue-300"
                      } rounded-lg focus:outline-none focus:ring-2 ${
                        toast &&
                        toast.type === "error" &&
                        nickname &&
                        !isValidName(nickname)
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  <div className="mb-4 text-left">
                    <label
                      htmlFor="middleName"
                      className="block text-sm font-medium text-blue-600"
                    >
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      type="text"
                      placeholder="e.g. John"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className={`w-full p-3 border ${
                        toast &&
                        toast.type === "error" &&
                        middleName &&
                        !isValidName(middleName)
                          ? "border-red-500"
                          : "border-blue-300"
                      } rounded-lg focus:outline-none focus:ring-2 ${
                        toast &&
                        toast.type === "error" &&
                        middleName &&
                        !isValidName(middleName)
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      }`}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Permutate <i className="fas fa-arrow-right ml-2"></i>
              </button>

              <button
                type="button"
                className="w-full bg-green-500 text-white p-3 rounded-lg mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setShowMoreSettings(!showMoreSettings)}
              >
                {showMoreSettings ? "Hide Settings" : "More Settings"}
              </button>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <textarea
              className="w-full h-64 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
              value={emails.join("\n")}
            />
            <p className="text-gray-600 mt-4">
              This tool generated{" "}
              <span className="font-bold text-green-600">
                {generatedEmailsCount} emails
              </span>
              .
            </p>
            <a
              href={composeGmailLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-4 block"
            >
              Open in Gmail
            </a>
            <button
              type="button"
              className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCopyToClipboard}
            >
              Copy to clipboard <i className="fas fa-clipboard ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
