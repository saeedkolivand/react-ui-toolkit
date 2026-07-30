import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider, useTheme, THEME_STORAGE_KEY } from "./ThemeContext";

const Probe = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme("dark")}>force-dark</button>
    </div>
  );
};

const setPrefersDark = (matches: boolean) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onchange: null,
  }));
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    setPrefersDark(false);
  });

  // The regression this guards: the provider used to track theme in state and
  // never touch the DOM, so all 219 `dark:` utilities in the library were dead.
  it("puts the dark class on <html> so Tailwind's class strategy works", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(screen.getByText("toggle"));

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("removes the dark class when toggling back to light", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("toggle"));
    expect(document.documentElement).toHaveClass("dark");

    fireEvent.click(screen.getByText("toggle"));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("persists the choice and restores it on next mount", () => {
    const { unmount } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("toggle"));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    unmount();
    document.documentElement.classList.remove("dark");

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("follows the OS preference when nothing is stored", () => {
    setPrefersDark(true);

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("lets a stored choice override the OS preference", () => {
    setPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("still works when localStorage throws (private mode)", () => {
    const getItem = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });

    expect(() =>
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>
      )
    ).not.toThrow();

    act(() => {
      fireEvent.click(screen.getByText("force-dark"));
    });
    expect(document.documentElement).toHaveClass("dark");

    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("throws a useful error when used outside the provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow("useTheme must be used within a ThemeProvider");
    spy.mockRestore();
  });
});
