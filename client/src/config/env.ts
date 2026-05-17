const fallbackApiUrl = "http://localhost:5000";

function validatePublicUrl(value: string | undefined, fallbackValue: string) {
  const nextValue = value?.trim() || fallbackValue;

  try {
    const parsedUrl = new URL(nextValue);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }

    const normalizedPathname = parsedUrl.pathname.replace(/\/$/, "");

    if (!normalizedPathname || normalizedPathname === "") {
      parsedUrl.pathname = "/api";
    } else if (normalizedPathname !== "/api") {
      parsedUrl.pathname = normalizedPathname.endsWith("/api")
        ? normalizedPathname
        : `${normalizedPathname}/api`;
    } else {
      parsedUrl.pathname = normalizedPathname;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_API_URL value. Use a full http or https URL.");
  }
}

function readAppName(value: string | undefined) {
  const nextValue = value?.trim();
  return nextValue || "Peblo AI Notes Workspace";
}

export const clientEnv = {
  apiUrl: validatePublicUrl(process.env.NEXT_PUBLIC_API_URL, fallbackApiUrl),
  appName: readAppName(process.env.NEXT_PUBLIC_APP_NAME),
} as const;
