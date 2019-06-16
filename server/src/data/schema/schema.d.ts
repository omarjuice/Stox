/// <reference path="../../../../types.d.ts" />
interface DBSchema {
    create: string
    drop: string
}


declare namespace UserSchema {
    interface I extends User {
        [key: string]: any
    }
    interface Create extends I {
        password: string
    }
    interface DB extends I {
        id: number
        createdAt: Date
        password?: string
    }
}
