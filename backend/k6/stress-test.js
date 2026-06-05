import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 50 },
        { duration: "30s", target: 100 },
        { duration: "30s", target: 150 },
        { duration: "30s", target: 200 },
        { duration: "30s", target: 200 },
      ],
    },
  },
};

export default function () {
  http.get("http://localhost:5000/recipes");
  sleep(1);
}