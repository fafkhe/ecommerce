import express from "express";
import decodeToken from "./jwt-auth";

export default (app) => {
  app.use(express.json());

  app.use((req, res, next) => {
    try {
      req.user = decodeToken(req.headers.auth);
    } catch (error) {
      req.user = null;
    }
    next();
  })
}