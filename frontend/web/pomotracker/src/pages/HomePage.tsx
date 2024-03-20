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
      {/* <Timer size={800} strokeWidth={10} time={10} /> */}
    </div>
  );
};
