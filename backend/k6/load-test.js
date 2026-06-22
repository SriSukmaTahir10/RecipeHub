import http from "k6/http";
import { sleep } from "k6";
import { API_URL } from "../config";

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
  http.get(`${API_URL}/recipes`);
  sleep(1);
}