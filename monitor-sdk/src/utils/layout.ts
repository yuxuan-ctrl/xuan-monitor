interface Box {
    x: number; // Left
    y: number; // Top
    w: number; // Width
    h: number; // Height
}

let idMap: WeakMap<Node, number> = new WeakMap(); // Maps node => id.
let values = [];
let index: number = 1;

export function target(evt: UIEvent): Node {
    let path = evt.composed && evt.composedPath ? evt.composedPath() : null;
    let node = (path && path.length > 0 ? path[0] : evt.target) as Node;
    // mutation.active(); // Mark active periods of time so mutations can continue uninterrupted
    return node.nodeType === Node.DOCUMENT_NODE ? (node as Document).documentElement : node;
}

export function link(node: Node): HTMLAnchorElement {
    while (node && node !== document) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            let element = node as HTMLElement;
            if (element.tagName === "A") {
                return element as HTMLAnchorElement;
            }
        }
        node = node.parentNode;
    }
    return null;
}

export function text(element: Node): string {
    let output = null;
    if (element) {
        // Grab text using "textContent" for most HTMLElements, however, use "value" for HTMLInputElements and "alt" for HTMLImageElement.
        let t = element.textContent || (element as HTMLInputElement).value || (element as HTMLImageElement).alt;
        if (t) {
            // Replace multiple occurrence of space characters with a single white space
            // Also, trim any spaces at the beginning or at the end of string
            // Finally, send only first few characters as specified by the Setting
            output = t.replace(/\s+/g, ' ').trim().substr(0, 25);
        }
    }
    return output;
}

export function layout(element: Element): Box {
    let box: Box = null;
    let de = document.documentElement;
    // getBoundingClientRect returns rectangle relative positioning to viewport
    if (typeof element.getBoundingClientRect === "function") {
        let rect = element.getBoundingClientRect();

        if (rect && rect.width > 0 && rect.height > 0) {
            // Add viewport's scroll position to rectangle to get position relative to document origin
            // Also: using Math.floor() instead of Math.round() because in Edge,
            // getBoundingClientRect returns partial pixel values (e.g. 162.5px) and Chrome already
            // floors the value (e.g. 162px). This keeps consistent behavior across browsers.
            box = {
                x: Math.floor(rect.left + ("pageXOffset" in window ? window.pageXOffset : de.scrollLeft)),
                y: Math.floor(rect.top + ("pageYOffset" in window ? window.pageYOffset : de.scrollTop)),
                w: Math.floor(rect.width),
                h: Math.floor(rect.height)
            };
        }
    }
    return box;
}


export function get(node: Node) {
    let id = getId(node);
    return id in values ? values[id] : null;
}

export function getId(node: Node, autogen: boolean = false): number {
    if (node === null) { return null; }
    let id = idMap.get(node);
    if (!id && autogen) {
        id = index++;
        idMap.set(node, id);
    }

    return id ? id : null;
}