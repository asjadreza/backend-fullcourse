import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for logged-in user
router.get("/", async(req, res) => {
  // const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  // const todos = getTodos.all(req.userId);

  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId
    }
  })

  res.json(todos);
});

// Create a new todo
router.post("/", async(req, res) => {
  const { task } = req.body;

  // const insertTodo = db.prepare(
  //   `INSERT INTO todos (user_id, task) VALUES (?, ?)`
  // );
  // const result = insertTodo.run(req.userId, task);

  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId
    }
  })

  res.json(todo);
});

// Update a todo
router.put("/:id", async(req, res) => {
    const {completed} = req.body;
    const {id} = req.params;
    const {page} = req.query; // this is only for the demonstration purpose

    // const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    // updatedTodo.run(completed, id)

    const updatedTodo = await prisma.todo.update({
      where: {
        // to update a todo we will match both todo id and userId if it is the correct user updating a todo or its someone else
        id: parseInt(id), // todo id
        userId: req.userId // user id
      },
      data: {
        completed: !!completed
      }

    })
    res.json(updatedTodo)
});

// Delete a todo
router.delete("/:id", async(req, res) => {
    const {id} = req.params;
    const userId = req.userId;

    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    // deleteTodo.run(id, userId);

    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId: userId
      }
    })


    res.send({message: "Todo deleted"})
});

export default router;
