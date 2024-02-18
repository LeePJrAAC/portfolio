import { useLoaderData } from "react-router-dom";

export const Edit = () => {
  const { todo } = useLoaderData();

  return (
    <div>
      <h1>Edit Todo</h1>
      {todo && (
        <div>
          <h2>{todo.id}</h2>
        </div>
      )}
    </div>
  );
};
