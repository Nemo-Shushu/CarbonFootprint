import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import SessionLayout from "../SessionLayout";
import { vi, beforeAll } from "vitest";

globalThis.jest = {
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};

beforeAll(() => {
  const _jest = globalThis.jest;
  globalThis.jest = {
    ...globalThis.jest,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };
  return () => void (globalThis.jest = _jest);
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("SessionLayout Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ remaining_time: 1 }),
    });

    vi.setConfig({ testTimeout: 10000 });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders children correctly", () => {
    render(
      <SessionLayout>
        <div>Test Content</div>
      </SessionLayout>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("shows the session extension modal when remaining time is below 5 minutes", async () => {
    render(
      <SessionLayout>
        <div>Test</div>
      </SessionLayout>,
    );
    act(() => {
      vi.advanceTimersByTime(600000);
    });

    await waitFor(
      () => {
        expect(screen.getByText("Session Extension")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("calls the extend session API when clicking Extend Session", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ remaining_time: 2 }),
    });

    render(
      <SessionLayout>
        <div>Test</div>
      </SessionLayout>,
    );

    act(() => {
      vi.advanceTimersByTime(600000);
    });

    await waitFor(
      () => {
        expect(screen.getByText("Session Extension")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    fireEvent.click(screen.getByText("Extend Session"));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/extend-session/"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("closes the modal when clicking Cancel", async () => {
    render(
      <SessionLayout>
        <div>Test</div>
      </SessionLayout>,
    );

    act(() => {
      vi.advanceTimersByTime(600000);
    });

    await waitFor(
      () => {
        expect(screen.getByText("Session Extension")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Extend Session"));
    });
  });
});
