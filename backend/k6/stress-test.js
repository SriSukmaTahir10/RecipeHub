import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 150 },
    { duration: "30s", target: 200 },
    { duration: "30s", target: 200 },
  ],
};

export default function () {
  http.get(
    "https://recipehub-production-a589.up.railway.app/recipes"
  );

  sleep(1);
}