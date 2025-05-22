import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = Router();

// Register a new user endpoint /auth/register
router.post("/register", async(req, res) => {
  const { username, password } = req.body;
  // Save the username and an irreversibly encrypted password
  // Save the asjad@gmail.com | akdjjksk...sdkskdkkie.kskikmksdjj

  // encrypt the password
  const hasshedPassword = bcrypt.hashSync(password, 8);
  // console.log(hasshedPassword);
  // saved the new user and the hashed password to the db
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hasshedPassword
      }
    })

    // Now that we have a user, I want to add their first todo for them
    const defaultTodo = `Hello :) Add your first todo!`
    // const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
    //     VALUES(?, ?)`)
    // insertTodo.run(result.lastInsertRowid, defaultTodo);

    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id
      }
    })

    // create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token })
  } catch (err) {
    console.log(err.message);
    res.send(503);
  }

  res.send(201);
});

router.post("/login", async(req, res) => {
  // We get their email, and we look up the password associated with that email in the database
  // but we get it back and its encrypted, which means that we cannot compare it to the one the
  // user just use trying to login
  // so what we can to do, is again one encrypt the password the user just entered

  const { username, password } = req.body;
  try {

    // const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
    // const user = getUser.get(username);

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      }
    })

    // if we cannot find a user associated with that username, return out from the function
    if(!user){
        return res.status(404).send({message: "User not found"})
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // if the password does not match, return out the fucntion
    if(!passwordIsValid) {
        return res.status(401).send({message: "Invalid password"})
    }

    console.log(user)

    // then we have successful authentication
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.json({token})
    
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
    
  }
});

export default router;
