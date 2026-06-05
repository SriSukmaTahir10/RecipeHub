import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    load_test: {
      executor: "constant-vus",
      vus: 50,
      duration: "1m",
    },
  },
};

export default function () {
  http.get("http://localhost:5000/recipes");
  sleep(1);
}