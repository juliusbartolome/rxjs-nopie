import { fromEvent } from "rxjs";
import { map, delay } from "rxjs/operators";

let circle = document.getElementById("circle");
let source = fromEvent(document, "mousemove")
                .pipe(
                    map((e: MouseEvent) => {
                        return {
                            x: e.clientX,
                            y: e.clientY
                        };
                    }),
                    delay(300)
                );

function onNext(value) {
    console.log(value);
    circle.style.left = `${value.x}px`;
    circle.style.top = `${value.y}px`;
}

source.subscribe(
    onNext,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);