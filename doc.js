const User = {
  _id: String,
  email: String,
  name: String,
  imgUrl: String,
  role: {
    type: String,
    enum: ["user", "admin"],
  },
};

const Product = {
  _id: String,
  name: String,
  price: Number,
  quantity: String,
  imgUrl: String,
  description: String,
  keywords: [String],
  isDisplayed: Boolean,
};

const Cart = {
  user: User,
  items: [
    {
      product: Product,
      quantity: Number,
    },
  ],
};

const endpoints = [
  // Auth section
  // SignUp
  {
    endpoint: "/auth/signup",
    method: "POST",
    body: {
      email: String,
      name: String,
      password: String,
    },
    requireAuth: false,
    requireAdminAuth: false,

    possibleErrors: [
      {
        error: "bad request: insufficient input",
      },
      {
        error: "email already in use",
      },
      {
        error: "the provided email is not a valid email",
      },
    ],
    response: {
      token: String,
    },
  },

  //Login
  {
    endpoint: "/auth/login",
    method: "POST",
    body: {
      email: String,
      password: String,
    },
    requireAuth: false,
    requireAdminAuth: false,
    possibleErrors: [
      {
        error: "bad request: insufficient input",
      },
      {
        error: "password is not valid",
      },
      {
        error: "the provided email is not a valid email",
      },
      {
        error: "email is not exist in database",
      },
    ],
  },
  // me

  {
    endpoint: "/auth/me",
    method: "POST",
    body: {},

    requireAuth: true,
    requireAdminAuth: false,
    possibleErrors: [
      {
        error: " unathorized: you are not login",
      },
    ],
    response: {
      msg: String,
      data: User,
    },
  },

  // create admin

  {
    endpoint: "/auth/create-admin",
    method: "POST",
    body: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    requireAdminAuth: true,
    possibleErrors: [
      {
        error: "unathorized",
      },
      {
        error: "bad request: insufficient input",
      },
    ],
    response: {
      msg: String,
    },
  },

  // admin me

  {
    endpoint: "/auth/admin-me",
    method: "POST",
    body: {},

    requireAuth: true,
    requireAdminAuth: true,
    possibleErrors: [
      {
        error: "you have no permission to access this page",
      },
    ],
    response: {
      msg: String,
      data: User,
    },
  },

  // Product

  // add product by admin

  {
    endpoint: "/product/add",
    method: "POST",
    body: {
      name: String,
      imgUrl: String,
      price: String,
      quantity: String,
      description: String,
      isDisplayed: Boolean,
      keywords: [String],
    },
    requireAuth: false,
    requireAdminAuth: true,

    possibleErrors: [
      {
        error: "unathorized",
      },
      {
        error: "bad request: insufficient input",
      },
    ],

    response: {
      msg: String,
      data: Product,
    },
  },

  // edit product by admin

  {
    endpoint: "/product/edit",
    method: "POST",
    body: {
      _id: String,
      data: {
        name: String,
        imgUrl: String,
        price: String,
        quantity: String,
        description: String,
        isDisplayed: Boolean,
        keywords: [String],
      },
    },
    requireAuth: false,
    requireAdminAuth: true,

    possibleErrors: [
      {
        error: "unathorized",
      },

      {
        error: "bad request: no such product found",
      },
    ],

    response: {
      msg: String,
      data: Product,
    },
  },

  // All product

  {
    endpoint: "/product",
    method: "GET",
    query: { text: String, page: String, limit: String },
    requireAuth: false,
    requireAdminAuth: false,

    response: {
      msg: String,
      data: Product,
    },
  },

  //single product

  {
    endpoint: "/product/:_id",
    method: "GET",
    requireAuth: false,
    requireAdminAuth: false,

    possibleErrors: [
      {
        error: "bad request: no such product found",
      },
    ],

    response: {
      msg: String,
      data: Product,
    },
  },

  // cart section

  // get cart
  {
    endpoint: "/cart",
    method: "GET",
    requireAuth: true,
    requireAdminAuth: false,

    possibleErrors: [
      {
        error: "unathorized",
      },
    ],

    response: {
      msg: String,
      data: Cart,
    },
  },

  // add to cart

  {
    endpoint: "/cart",
    method: "POST",
    requireAuth: true,
    requireAdminAuth: false,

    body: {
      productId: String,
    },

    possibleErrors: [
      {
        error: "unathorized",
      },
      {
        error: "no such product found",
      },
      {
        error: "the maximum product is 10 , you can not add !",
      },
    ],
    response: {
      msg: String,
    },
  },

  // remove from cart

  {
    endpoint: "/cart",
    method: "DELETE",
    requireAuth: true,
    requireAdminAuth: false,

    body: {
      productId: String,
    },

    possibleErrors: [
      {
        error: "unathorized",
      },
      {
        error: "your cart does'nt contain this product",
      },
    ],
    response: {
      msg: String,
    },
  },

  // change cart

  {
    endpoint: "/cart",
    method: "PATCH",
    requireAuth: true,
    requireAdminAuth: false,

    body: {
      productId: String,
      quantity: Number,
    },

    possibleErrors: [
      {
        error: "unathorized",
      },
      {
        error: "quantity should be an integer between 1-10",
      },
      {
        error: "your cart does'nt contain this product",
      },
    ],
    response: {
      msg: String,
    },
  },
];
