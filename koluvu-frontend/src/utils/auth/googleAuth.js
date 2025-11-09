// Google OAuth configuration and utility functions
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

console.log("Google Client ID loaded:", GOOGLE_CLIENT_ID);

export const initializeGoogleOAuth = () => {
  return new Promise((resolve, reject) => {
    // Validate client ID first
    if (!GOOGLE_CLIENT_ID) {
      reject(
        new Error(
          "Google Client ID is not configured. Check your .env.local file."
        )
      );
      return;
    }

    console.log("Initializing Google OAuth with Client ID:", GOOGLE_CLIENT_ID);

    // Check if google is already loaded
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        resolve(window.google);
      } else {
        reject(new Error("Google Identity Services failed to load"));
      }
    };
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = async (userType = "employee") => {
  try {
    console.log("Starting Google OAuth flow for userType:", userType);
    console.log("Client ID check:", GOOGLE_CLIENT_ID);

    if (!GOOGLE_CLIENT_ID) {
      throw new Error(
        "Google Client ID is missing. Please check your environment variables."
      );
    }

    await initializeGoogleOAuth();

    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          console.log("Google OAuth response received:", response);

          try {
            // Send credential token to your backend
            console.log("Sending credential to backend...");
            const backendResponse = await fetch("/api/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                credential: response.credential,
                user_type: userType,
              }),
            });

            console.log("Backend response status:", backendResponse.status);

            if (!backendResponse.ok) {
              let errorData = {};
              try {
                const responseText = await backendResponse.text();
                if (responseText) {
                  errorData = JSON.parse(responseText);
                } else {
                  // Empty response body
                  errorData = {
                    error: `Authentication failed - Server returned ${backendResponse.status} ${backendResponse.statusText}`,
                  };
                }
              } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
                errorData = {
                  error: `Authentication failed (Status: ${backendResponse.status})`,
                };
              }

              console.error("Backend authentication error:", {
                status: backendResponse.status,
                statusText: backendResponse.statusText,
                errorData: errorData,
                url: backendResponse.url,
              });
              // Return error data instead of throwing, so caller can handle it
              resolve({
                error:
                  errorData.error ||
                  errorData.message ||
                  `Authentication failed (Status: ${backendResponse.status} ${backendResponse.statusText})`,
                existing_user_type: errorData.existing_user_type,
                details: errorData,
              });
              return;
            }

            const data = await backendResponse.json();
            console.log("Authentication successful:", data);
            console.log("User type returned:", data.user_type);
            console.log("User data:", data.user);
            resolve(data);
          } catch (error) {
            console.error("Backend authentication error:", error);
            reject(error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Use Google One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        console.log("Google prompt notification:", notification);

        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One Tap not available, using popup");

          // Fallback: Create a temporary button and trigger it
          const tempDiv = document.createElement("div");
          tempDiv.style.position = "fixed";
          tempDiv.style.top = "-1000px";
          tempDiv.style.left = "-1000px";
          document.body.appendChild(tempDiv);

          window.google.accounts.id.renderButton(tempDiv, {
            theme: "outline",
            size: "large",
            type: "standard",
          });

          // Simulate click after a short delay
          setTimeout(() => {
            const button = tempDiv.querySelector('div[role="button"]');
            if (button) {
              button.click();
            } else {
              document.body.removeChild(tempDiv);
              reject(new Error("Failed to create Google sign-in button"));
            }
          }, 100);
        }
      });
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const signOutFromGoogle = async () => {
  try {
    if (window.gapi && window.gapi.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    }
  } catch (error) {
    console.error("Google sign-out error:", error);
  }
};
