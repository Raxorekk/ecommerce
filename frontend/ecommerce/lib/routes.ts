export const PROTECTED_ROUTES = [] as string[];
export const PUBLIC_ROUTES = ["/login", "/register"];

const CATEGORIES_ROOT = "/products/categories"

export const CATEGORIES = {
  MONITORS: `${CATEGORIES_ROOT}/monitors`,
  GRAPHICS_CARDS: `${CATEGORIES_ROOT}/graphics-cards`,
  PROCESSORS: `${CATEGORIES_ROOT}/processors`,
  MEMORY: `${CATEGORIES_ROOT}/memory`,
  STORAGE: `${CATEGORIES_ROOT}/storage`,
  AUDIO: `${CATEGORIES_ROOT}/audio`,
}