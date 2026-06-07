export default {
  async fetch(request) {
    const menuA = "https://example-food.co/menu/family-combos";
    const menuB = "https://example-food.co/menu/quick-lunch";

    const variant =
      Math.random() < 0.5 ? "menu_a_family_combos" : "menu_b_quick_lunch";

    const target = variant === "menu_a_family_combos" ? menuA : menuB;

    const url = new URL(target);

    url.searchParams.set("utm_source", "restaurant_qr");
    url.searchParams.set("utm_medium", "qr");
    url.searchParams.set("utm_campaign", "menu_ab_test_june");
    url.searchParams.set("utm_content", variant);

    return Response.redirect(url.toString(), 302);
  }
};
