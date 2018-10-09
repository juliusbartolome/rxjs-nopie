import { fromEvent, Observable } from "rxjs";
import { map, delay } from "rxjs/operators";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function load(url: string) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
        let posts = JSON.parse(xhr.responseText);
        posts.forEach(post => {
            let div = document.createElement("div");
            let hr = document.createElement("hr");
            div.innerText = post.title;
            output.appendChild(div);
            output.appendChild(hr);
        });
    });

    xhr.open("GET", url);
    xhr.send();
}

click.subscribe(
    value => load("https://jsonplaceholder.typicode.com/posts"),
    e => console.error(`error: ${e}`),
    () => console.log("complete")
);