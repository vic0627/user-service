import "reflect-metadata";
import IOCContainer from "./decorator/IOCContainer";
import Injectable from "./decorator/Injectable";
import Expose from "./decorator/Expose";

class Provide1 {
    prop = "provide1";
}

class Provide2 {
    prop = "provide2";
}

@Expose()
@Injectable()
class Inject1 {
    constructor(private readonly provide2: Provide2) {}

    print(str: string) {
        console.log(str);
    }

    getProp() {
        this.print(this.provide2.prop);
    }
}

@Injectable()
class Inject2 {
    constructor(private readonly provide1: Provide1) {}

    print() {
        console.log(this.provide1.prop);
    }
}

@IOCContainer({
    provides: [Provide1, Provide2],
    imports: [Inject1, Inject2],
})
class Module {
    constructor() {}
}

export default Module;
