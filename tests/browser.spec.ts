import { test, expect } from "@playwright/test";
test("landing, demo and responsive layouts", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Their whole world.",
  );
  await page.getByRole("link", { name: "Take a little look" }).click();
  await expect(page).toHaveURL(/demo/);
  await expect(
    page.getByText("All pets and activity shown here are fictional.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Milo" })).toBeVisible();
  for (const url of ["/", "/demo", "/login", "/signup", "/about"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.goto("/");
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  await page.screenshot({ path: "/tmp/pawr-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "/tmp/pawr-desktop.png", fullPage: true });
  expect(errors).toEqual([]);
});
test("protected workspace routes redirect visitors", async ({ page }) => {
  for (const route of ["/dashboard", "/pets", "/pets/new", "/profile"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Welcome back",
    );
  }
});
test("unconfigured signup is an honest error", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Your name").fill("Test owner");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: false }).fill("local-test-only");
  await page.getByRole("button", { name: "Create your account" }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Connect Supabase first",
  );
});
