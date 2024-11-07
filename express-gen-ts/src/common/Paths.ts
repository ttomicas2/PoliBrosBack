/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/",
    Add: "/",
    Update: "/",
    Delete: "/:id",
    LogIn: "/login",
  },
  Mapas: {
    Base: "/mapas",
    Get: "/",
    GetPage:"/page/:page/limit/:limit",
    GetOne: "/:id",
    GetFromCreator: "/creator/:email",
    GetPageFromCreator:"/creator/:email/page/:page/limit/:limit",
    Add: "/",
    Update: "/",
    Delete: "/:id",
    AddVisita: "/visita/:id",
  },
} as const;
