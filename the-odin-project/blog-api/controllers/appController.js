const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("../generated/prisma");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

module.exports = {};
