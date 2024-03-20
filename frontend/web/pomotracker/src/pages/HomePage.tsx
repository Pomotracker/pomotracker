import { AuthContext } from "@/App";

import { Button } from "@/components/ui/button";
import { useContext } from "react";

export const Homepage = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="text-2xl">
      <p>hello world </p>
      <Button variant="destructive" onClick={() => auth?.logout()}>
        Logout
      </Button>
    </div>
  );
};
