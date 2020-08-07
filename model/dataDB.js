const topMeals=[
    {
        image: "/img/ketoSlowRoastBeefwithCreamedCabbage.jpg", 
        title: "Keto Slow Roast Beef with Creamed Cabbage",
        price: "$11.95"
    }, {
        image: "/img/coconutCurryShrimp.jpg",
        title: "Coconut Curry Shrimp", 
        price: "$11.95"
    }, {
        image: "/img/buffaloGoatCheeseChicken.jpg",
        title: "Buffalo Goat Cheese Chicken (Spicy)", 
        price: "$11.95"
    }, {
        image: "/img/BeefGratin.jpg",
        title: "Beef Gratin", 
        price: "$11.95"
    }
];
module.exports.topMealsDB=topMeals; 

const mealPackages=[
    {
        image: "/img/veganPackage.jpg",
        title: "Vegan Package",
        price: "$159",
        foodCategory: "Vegan",
        numberOfMeals: "15",
        synopsis: "A fully plant-based package featuring vegan meat and no animal products",
        topPackage: true
    }, {
        image: "/img/veggiePackage.jpg",
        title: "Veggie Package",
        price: "$159",
        foodCategory: "Vegetarian",
        numberOfMeals: "15",
        synopsis: "A vegetarian-friendly package with a natural and nutrient-rich approach",
        topPackage: true
    }, {
        image: "/img/glutenFreePackage.jpg",
        title: "Gluten Free Package",
        price: "$117",
        foodCategory: "Gluten free",
        numberOfMeals: "12",
        synopsis: "A gluten-free package with the same balanced profile as our other packages",
        topPackage: false
    }, {
        image: "/img/prebioticSoupCleanse.jpg",
        title: "Prebiotic Soup Cleanse",
        price: "$129",
        foodCategory: "Prebiotic",
        numberOfMeals: "21",
        synopsis: "A vegetarian-friendly package with a natural and nutrient-rich approach",
        topPackage: false
    }
];
module.exports.mealPackagesDB=mealPackages;