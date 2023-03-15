// pages/index.jsx

import {
  Heading,
  Center,
  Button,
  Box,
  Input,
  FormControl as Form,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [refresh, setRefresh] = useState(false);

  const getTodos = () => {
    axiosInstance.get("/getAllTodos").then((res) => setTodos(res.data));
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (refresh) {
      getTodos();

      setTimeout(() => {
        setRefresh(false);
      });
    }
  }, [refresh]);

  const deleteTodo = (todoId) => () => {
    axiosInstance
      .delete("/deleteTodo", {
        data: { todoId },
      })
      .then(() => setRefresh(true));
  };

  const addTodo = (e) => {
    e.preventDefault();
    axiosInstance.post("/addTodo", { title: inputVal }).then(() => {
      setRefresh(true);
      setInputVal("");
    });
  };

  return (
    <>
      <Heading
        mb={10}
        paddingLeft={10}
        paddingBottom={15}
        paddingTop={20}
        bg="#222"
        color="#ddd"
      >
        Grocery List
      </Heading>

      <Form as="form" mb={12} paddingLeft={10} onSubmit={addTodo}>
        <Input
          onChange={(e) => setInputVal(e.target.value)}
          width="300px"
          placeholder="New groccery"
          size="md"
          value={inputVal}
        />
        <Button type="submit">Add</Button>
      </Form>

      {todos.map(({ _id, title }) => (
        <Box key={_id} mb={12} paddingTop={10} paddingLeft={10}>
          <Center w="250px" h="50px" bg="#222" color="#ddd" mb={5}>
            {title}
          </Center>
          <Button ml={20} bg="red.200" onClick={deleteTodo(_id)}>
            Delete
          </Button>
        </Box>
      ))}
    </>
  );
};

export default Home;
