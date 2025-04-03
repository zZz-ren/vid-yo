import { NextFunction, Response, Request } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = req.session.user;
    if (!user || !user.isAuthenticated) {
      throw new Error("Not authenticated");
    }

    next();
  } catch (error: any) {
    console.error("Error in CheckAuth:", error.message || error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

  
