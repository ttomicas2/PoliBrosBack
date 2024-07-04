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
  },
  Mapas: {
    Base: "/mapas",
    Get: "/",
    Add: "/",
    Update: "/",
    Delete: "/:id",
  },
} as const;
