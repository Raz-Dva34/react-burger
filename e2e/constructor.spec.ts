import { expect, test } from '@playwright/test';

const API_URL = 'https://new-stellarburgers.education-services.ru/api';
const HAR_PATH = 'e2e/fixtures/constructor.har';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.routeFromHAR(HAR_PATH, {
    url: `${API_URL}/**`,
  });
});

test('allows user to build burger, inspect ingredient and create order', async ({
  page,
}) => {
  await page.goto('/');

  const bunCard = page.getByTestId('ingredient-card-bun-1');
  const sauceCard = page.getByTestId('ingredient-card-sauce-1');
  const constructor = page.getByTestId('burger-constructor-drop-target');
  const closeModalButton = page.getByTestId('modal-close-button');
  const createOrderButton = page.getByTestId('create-order-button');
  const modal = page.getByTestId('modal');
  const orderDetails = page.getByTestId('order-details');
  const orderNumber = page.getByTestId('order-number');

  await expect(page.getByText('Соберите бургер')).toBeVisible();
  await expect(bunCard).toBeVisible();
  await expect(sauceCard).toBeVisible();

  await sauceCard.click();
  await expect(modal).toContainText('Соус Spicy-X');
  await expect(modal).toContainText('Калории,ккал');
  await closeModalButton.click();
  await expect(modal).toBeHidden();

  await bunCard.dragTo(constructor);
  await sauceCard.dragTo(constructor);

  await expect(constructor).toContainText('Краторная булка (верх)');
  await expect(constructor).toContainText('Краторная булка (низ)');
  await expect(constructor).toContainText('Соус Spicy-X');

  const orderRequestPromise = page.waitForRequest(`${API_URL}/orders`);

  await createOrderButton.click();

  const orderRequest = await orderRequestPromise;
  const orderRequestBody = orderRequest.postDataJSON() as { ingredients: string[] };
  const orderRequestIngredients = orderRequestBody.ingredients;

  await expect(orderDetails).toBeVisible();
  await expect(orderNumber).toHaveText('12345');
  expect(orderRequestIngredients).toEqual(['bun-1', 'sauce-1', 'bun-1']);

  await closeModalButton.click();
  await expect(orderDetails).toBeHidden();
});
