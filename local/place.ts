import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("place")
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  place: string;

  @Column()
  name: string;

  @Column({ type: "time" })
  hourBegin: string;

  @Column({ type: "time" })
  hourEnd: string;

  @Column()
  day: string;

  @Column()
  door: string;

  @Column({ type: "date" })
  date: string;

  @Column()
  quota: number;
}
