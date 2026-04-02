import { toast } from "sonner";
import { AxiosError } from "axios";

export const apiErrorResolver = (error: AxiosError | any) => {
  if (!error.response) {
    if (error.message.includes("Network Error")) {
      toast.error("Network Error: Please check your internet connection.");
    }
    return;
  }

  const status = error.response.status;
  const data = error.response.data;
  const message = data?.error?.message || data?.message || "An unexpected error occurred.";

  switch (status) {
    case 403:
      toast.error("Access Denied", {
        description: message || "You do not have permission to perform this action.",
      });
      break;
    case 409:
      toast.error("Conflict", {
        description: message || "The resource already exists or violates a uniqueness constraint.",
      });
      break;
    case 422:
      let details = "";
      if (data?.error?.details) {
        details = Object.entries(data.error.details)
          .map(([key, msgs]: [string, any]) => `${key}: ${msgs.join(", ")}`)
          .join(" | ");
      }
      toast.error("Validation Error", {
        description: details || message,
      });
      break;
    case 500:
      toast.error("Server Error", {
        description: "Something went wrong on our end. Please try again later.",
      });
      break;
    default:
      // Status 400 or others can be handled by individual hooks or components
      // but we log here just in case.
      break;
  }

  return Promise.reject(error);
};
