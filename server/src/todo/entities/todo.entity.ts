import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks' })
export class Todo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 200 })
    title: string

    @Column({ type: 'varchar', length: 200 })
    content: string
}
 