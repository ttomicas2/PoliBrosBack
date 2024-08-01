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
    GetFromCreator: "/:email",
    Add: "/",
    Update: "/",
    Delete: "/:id",
  },
} as const;
