import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Profile from "../Profile";

const mockFetch = () => {
  global.fetch = vi.fn((requestUrl) => {
    if (requestUrl.includes("send-email-confirmation-token")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Code sent successfully" }),
      });
    }
    if (requestUrl.includes("confirm-email")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Email verified successfully" }),
      });
    }
    if (requestUrl.includes("update-email")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }
    return Promise.reject(new Error("Unexpected API call"));
  });
};

describe("Profile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch();
  });

  it("renders Profile component", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Forename:/)).toBeInTheDocument();
    expect(screen.getByText(/Surname:/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
  });

  it("opens Edit Profile modal when clicking the edit button", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    await waitFor(() => {
      expect(screen.getByText("Profile Update")).toBeInTheDocument();
    });
  });

  it("opens Update Email modal when clicking update email button", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    await waitFor(() => {
      expect(screen.getByText("Change Email")).toBeInTheDocument();
    });
  });

  it("updates email state when user types a new email", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    const emailInput = screen.getByPlaceholderText("Enter new email");
    fireEvent.change(emailInput, {
      target: { value: "test@university.ac.uk" },
    });

    expect(emailInput.value).toBe("test@university.ac.uk");
  });

  it("sends email verification code when clicking 'Send Code'", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    const emailInput = screen.getByPlaceholderText("Enter new email");
    fireEvent.change(emailInput, {
      target: { value: "test@university.ac.uk" },
    });

    const sendCodeButton = screen.getByText(/Send code/i);
    fireEvent.click(sendCodeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.any(Object),
      );
    });
  });

  it("verifies email when clicking 'Verify my Email'", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    const emailInput = screen.getByPlaceholderText("Enter new email");
    fireEvent.change(emailInput, {
      target: { value: "test@university.ac.uk" },
    });

    fireEvent.click(screen.getByText(/Send code/i));

    const codeInput = screen.getByPlaceholderText("Enter the code here");
    fireEvent.change(codeInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText(/Verify my Email/i);
    fireEvent.click(verifyButton);
  });

  it("shows alert when passwords do not match", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
    });

    window.alert.mockRestore();
  });

  it("updates email when clicking 'Update'", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    const emailInput = screen.getByPlaceholderText("Enter new email");
    fireEvent.change(emailInput, {
      target: { value: "test@university.ac.uk" },
    });

    fireEvent.click(screen.getByText(/Send code/i));

    const codeInput = screen.getByPlaceholderText("Enter the code here");
    fireEvent.change(codeInput, { target: { value: "123456" } });

    fireEvent.click(screen.getByText(/Verify my Email/i));

    fireEvent.click(screen.getByRole("button", { name: /Update Email/i }));
  });

  it("toggles password visibility", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput.type).toBe("password");

    const showButtons = screen.getAllByText(/Show/i);
    fireEvent.click(showButtons[0]);
    expect(passwordInput.type).toBe("text");

    const hideButtons = screen.getAllByText(/Hide/i);
    fireEvent.click(hideButtons[0]);
    expect(passwordInput.type).toBe("password");
  });

  it("submits profile update when passwords match", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api/accounts/update/"),
        expect.any(Object),
      );
    });
  });

  it("shows error when updating email without verification", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    fireEvent.change(screen.getByPlaceholderText("Enter new email"), {
      target: { value: "test@university.ac.uk" },
    });

    const modal = screen.getByText("Change Email").closest(".modal-content");
    const updateButton = within(modal).getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(
        screen.getByText("An unknown error occurred."),
      ).toBeInTheDocument();
    });
  });

  it("fetches session and user data on mount", async () => {
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("api2/session")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ session: "active" }),
        });
      }
      if (url.includes("api2/whoami")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              forename: "Test",
              lastname: "User",
              email: "test@example.com",
            }),
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api2/session"),
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api2/whoami"),
        expect.any(Object),
      );
    });

    global.fetch.mockRestore();
  });

  it("shows error message when sendCode API fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));
    fireEvent.change(screen.getByPlaceholderText("Enter new email"), {
      target: { value: "test@university.ac.uk" },
    });
    fireEvent.click(screen.getByText(/Send code/i));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error sending code:",
        expect.any(Error),
      );
    });

    console.error.mockRestore();
  });

  it("shows alert if email is not .ac.uk", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    const emailInput = screen.getByPlaceholderText("Enter new email");
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    fireEvent.click(screen.getByText(/Send code/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Email must belong to an educational institution (.ac.uk).",
      );
    });

    window.alert.mockRestore();
  });

  it("shows alert when email input is empty", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Update Email/i));

    fireEvent.click(screen.getByText(/Send code/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill Email first");
    });

    window.alert.mockRestore();
  });

  it("updates profile form state when input changes", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    const firstNameInput = screen.getByPlaceholderText("Forename");
    fireEvent.change(firstNameInput, { target: { value: "NewName" } });

    expect(firstNameInput.value).toBe("NewName");
  });

  it("shows error when CSRF token is missing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/Edit Profile/i));

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    document.cookie = "";
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    console.error.mockRestore();
  });
});
