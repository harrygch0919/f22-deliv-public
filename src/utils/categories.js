// List of options for entry categories
// ! DO NOT CHANGE THIS

export const categories = [
   { id: 0, name: "Default" },
   { id: 1, name: "Startup" },
   { id: 2, name: "Nonprofit" },
   { id: 3, name: "Misc" }
];

export function getCategory(category_id) {
   return categories.find(x => x.id === category_id)
}