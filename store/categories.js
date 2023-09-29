const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "hiking",
    label: "Hiking Equipment",
    id: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "toolbox",
    label: "Home Tools",
    id: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "cellphone",
    label: "Electronics",
    id: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "flower",
    label: "Gardening Tools",
    id: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "camera",
    label: "Cameras",
    id: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "laptop",
    label: "Computers",
    id: 6,
  }
];

const getCategories = () => categories;

const getCategory = id => categories.find(c => c.id === id);

module.exports = {
  getCategories,
  getCategory
};
