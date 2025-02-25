import { describe, test, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../Sidebar";

// ✅ Mock fetch 请求
const mockFetch = (isAdmin) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          forename: "Test User",
          email: "test@example.com",
          isAdmin: isAdmin, // ✅ 这里控制返回的 isAdmin 值
        }),
    })
  );
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders 'Admin Tool' when user is an admin", async () => {
    mockFetch(true); // ✅ 模拟 API 返回 isAdmin = true

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // ✅ 等待组件渲染完成
    await waitFor(() => expect(screen.getByText("Admin Tool")).toBeInTheDocument());

    // ✅ 确保 Request Admin 不渲染
    expect(screen.queryByText("Request Admin")).toBeNull();
  });

  test("renders 'Request Admin' when user is not an admin", async () => {
    mockFetch(false); // ✅ 模拟 API 返回 isAdmin = false

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // ✅ 等待组件渲染完成
    await waitFor(() => expect(screen.getByText("Request Admin")).toBeInTheDocument());

    // ✅ 确保 Admin Tool 不渲染
    expect(screen.queryByText("Admin Tool")).toBeNull();
  });

  test("navigates to the correct page when clicking on links", async () => {
    mockFetch(false); // ✅ 这里测试非管理员时的导航行为

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // ✅ 等待 "Request Admin" 出现
    await waitFor(() => expect(screen.getByText("Request Admin")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Dashboard"));
    expect(window.location.pathname).toBe("/dashboard");

    fireEvent.click(screen.getByText("Request Admin"));
    expect(window.location.pathname).toBe("/request-admin");
  });

  test("does not render 'Request Admin' when user is an admin", async () => {
    mockFetch(true); // ✅ 测试 isAdmin = true 的情况

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // ✅ 等待 "Admin Tool" 渲染
    await waitFor(() => expect(screen.getByText("Admin Tool")).toBeInTheDocument());

    // ✅ 确保 "Request Admin" 不出现
    expect(screen.queryByText("Request Admin")).toBeNull();
  });
});
