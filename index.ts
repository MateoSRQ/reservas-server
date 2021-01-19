import { Cuestionario } from "./local/cuestionario";
import { CuestionarioEmpleado } from "./local/cuestionarioempleado";

// const setTZ = require("set-tz");
// setTZ("UTC");

import SMTPTransport from "nodemailer/lib/smtp-transport";
const express = require("express");
import { Request, Response } from "express";
import { Column, createConnection } from "typeorm";
import { MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { Place } from "./local/place";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Reserva } from "./local/reserva";
import moment from "moment";

dotenv.config();

// register routes
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587, // port for secure SMTP
  //secureConnection: false,
  secure: false,
  //ignoreTLS: true,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

const unique = (value: any, index: any, self: any) => {
  return self.indexOf(value) === index;
};

createConnection().then((connection) => {
  const placeRepository = connection.getRepository(Place);
  const reservaRepository = connection.getRepository(Reserva);
  const cuestionarioRepository = connection.getRepository(Cuestionario);
  const cuestionarioEmpleadoRepository = connection.getRepository(
    CuestionarioEmpleado
  );
  // create and setup express app
  const app = express();
  app.use(cors());
  app.use(express.json());

  // register routes
  app.get("/reset", async function (req: Request, res: Response) {
    // here we will have logic to return all users
    let config = [
      {
        place: "Villa María del Triunfo",
        name: "A-01 Recreaciòn",
        dates: ["2021-01-06", "2021-01-08", "2021-01-10"],
        days: ["Miércoles", "Viernes", "Domingo"],
        quota: 10000,
        hoursBegin: ["05:45:00", "13:45:00"],
        hoursEnd: ["11:00:00", "18:00:00"],
        door: "VMZP05X",
      },
      {
        place: "Villa María del Triunfo",
        name: "A-05 Tenis CT01",
        dates: ["2021-01-05", "2021-01-07", "2021-01-09"],
        days: ["Martes", "Jueves", "Sàbado"],
        quota: 4,
        hoursBegin: [
          "06:00:00",
          "07:00:00",
          "08:00:00",
          "09:00:00",
          "10:00:00",
          "14:00:00",
          "15:00:00",
          "16:00:00",
          "17:00:00",
        ],
        hoursEnd: [
          "07:00:00",
          "08:00:00",
          "09:00:00",
          "10:00:00",
          "11:00:00",
          "15:00:00",
          "16:00:00",
          "17:00:00",
          "18:00:00",
        ],
        door: "VMZP08X",
      },
      {
        place: "Villa María del Triunfo",
        name: "A-05 Tenis CT02",
        dates: ["2021-01-05", "2021-01-07", "2021-01-09"],
        days: ["Martes", "Jueves", "Sàbado"],
        quota: 4,
        hoursBegin: [
          "06:00:00",
          "07:00:00",
          "08:00:00",
          "09:00:00",
          "10:00:00",
          "14:00:00",
          "15:00:00",
          "16:00:00",
          "17:00:00",
        ],
        hoursEnd: [
          "07:00:00",
          "08:00:00",
          "09:00:00",
          "10:00:00",
          "11:00:00",
          "15:00:00",
          "16:00:00",
          "17:00:00",
          "18:00:00",
        ],
        door: "VMZP08X",
      },
      {
        place: "Villa María del Triunfo",
        name: "A-06 Atletismo",
        dates: ["2021-01-05", "2021-01-07", "2021-01-09"],
        days: ["Martes", "Jueves", "Sàbado"],
        quota: 9999,
        hoursBegin: ["05:45:00", "13:45:00"],
        hoursEnd: ["11:00:00", "18:00:00"],
        door: "VMZP08X",
      },
      {
        place: "Villa María del Triunfo",
        name: "A-07 Ciclismo",
        dates: ["2021-01-05", "2021-01-07", "2021-01-09"],
        days: ["Martes", "Jueves", "Sàbado"],
        quota: 9999,
        hoursBegin: ["05:45:00", "13:45:00"],
        hoursEnd: ["11:00:00", "18:00:00"],
        door: "VMZP08X",
      },
    ];
    try {
      console.log("reset");
      for (let i = 0; i < config.length; i++) {
        for (let j = 0; j < config[i].dates.length; j++) {
          for (let k = 0; k < config[i].hoursBegin.length; k++) {
            await placeRepository.insert({
              place: config[i].place,
              name: config[i].name,
              date: config[i].dates[j],
              quota: config[i].quota,
              hourBegin: config[i].hoursBegin[k],
              hourEnd: config[i].hoursEnd[k],
              day: config[i].days[j],
              door: config[i].door,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    res.json({ message: "hello" });
  });

  app.get("/places", async function (req: Request, res: Response) {
    console.log("places");
    let { quota, ...rest } = req.query;
    let where = [];
    where.push(rest);
    if (quota) {
      where.push({ quota: LessThanOrEqual(quota) });
    }
    const places = await placeRepository.find({ where: where });

    res.json(places);
  });

  app.post("/cuestionarioempleado", async function (
    req: Request,
    res: Response
  ) {
    console.log("cuestionariosempleados");
    console.log(req.body);

    try {
      await cuestionarioEmpleadoRepository.save({ ...req.body });
      if (!req.body.apto) {
        console.log("sending mail");
        await transporter.sendMail(
          {
            from:
              '"Proyecto Especial Juegos Panamericanos Lima 2019" noreply$lima2019.pe',
            //from: "msanroman@legado.gob.pe",
            to: "msanroman@legado.gob.pe",
            subject: "Ficha sintomatologica - POSITIVO",
            //text: `Estimado/a ${rest.nombres}: Ud. ha sido confirmado`,
            html: `
            <p>Estimado/a Doctor/a</p>
            <p>El suscriptor ${req.body.nombres} ${
              req.body.apellidos
            }, con documento # ${req.body.nro_doc} y celular ${
              req.body.celular
            } ha declarado el o los siguientes sìntomas</p>
            <ul>
                <li>Fiebre: ${
                  req.body.sintomaFiebre === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Diarrea: ${
                  req.body.sintomaDiarrea === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Cefalea: ${
                  req.body.sintomaDolorCabeza === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Tos: ${
                  req.body.sintomaTos === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Irritabilidad: ${
                  req.body.sintomaIrritabilidad === "T"
                    ? "POSITIVO"
                    : "NEGATIVO"
                }</li>
                <li>Congestión: ${
                  req.body.sintomaCongestion === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Respiración: ${
                  req.body.sintomaRespiracion === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Anosmia: ${
                  req.body.sintomaOlor === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
                <li>Ageusia: ${
                  req.body.sintomaSabor === "T" ? "POSITIVO" : "NEGATIVO"
                }</li>
            </ul>
          `,
          },
          (err: any, info: any) => {
            console.log(err);
            // console.log(info.envelope);
            // console.log(info.messageId);
            // info.message.pipe(process.stdout);
          }
        );
      }
      console.log("mail sent!");
      res.status(200).send({ ...req.body });
    } catch (e) {
      res.status(400).send("nok");
      console.log("mail not sent!");
    }
  });

  app.get("/places/places", async function (req: Request, res: Response) {
    console.log("places");

    const date_ob = new Date();
    let _date =
      date_ob.getFullYear() +
      "-" +
      ("0" + (date_ob.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date_ob.getUTCDate()).slice(-2);
    console.log(_date);

    let _time =
      date_ob.getHours() +
      ":" +
      date_ob.getMinutes() +
      ":" +
      date_ob.getSeconds();
    console.log(_time);

    let { quota, ...rest } = req.query;
    // @ts-ignore
    //rest.date = MoreThanOrEqual(_date);

    if (quota) {
      console.log(quota);
      // @ts-ignore
      rest.quota = MoreThanOrEqual(quota);

      //where.push({ quota: LessThanOrEqual(quota) });
      //where.push({ quota: LessThanOrEqual(1) });
    }
    console.log("ERST");
    console.log(rest);
    let places = await placeRepository.find({
      where: rest,
    });

    res.json(places);
  });

  app.post("/reservas", async function (req: Request, res: Response) {
    let { grupo, event_id, ...rest } = req.body;

    // chequear en el mismo dia
    // @ts-ignore
    let oneThere = await reservaRepository.find({
      nrodocumento: rest.nrodocumento,
    });
    let manyThere = await reservaRepository.find({
      parent_doc: rest.nrodocumento,
    });

    console.log(oneThere);
    console.log(manyThere);
    if (oneThere.length || manyThere.length) {
      return res.send("already there");
    }

    const place = await placeRepository.findOne(event_id);
    let { id, date, ...place_rest } = place;
    console.log("place");
    await reservaRepository.insert({
      ...rest,
      ...place_rest,
      date: moment(date).add(1, "d").toString(),
    });
    await cuestionarioRepository.insert({
      apellidos: req.body.apellido_paterno + " " + req.body.apellido_materno,
      celular: req.body.phone,
      nombres: req.body.nombres,
      nro_doc: req.body.nrodocumento,
      apto: "1",
    });

    let list = "";
    list += `<li>${rest.nombres} ${rest.apellido_paterno} ${rest.apellido_materno}, -- ${rest.nrodocumento}</li>`;
    if (grupo) {
      for (let i = 0; i < grupo.length; i++) {
        let other = {
          ...rest,
          ...grupo[i],
          ...place_rest,
          date: moment(date).add(1, "d").toString(),
          parent_doc: rest.nrodocumento,
        };
        await reservaRepository.insert(other);
        await cuestionarioRepository.insert({
          apellidos: other.apellido_paterno + " " + other.apellido_materno,
          celular: other.phone,
          nombres: other.nombres,
          nro_doc: other.nrodocumento,
          apto: "1",
        });
        list += `<li>${other.nombres} ${other.apellido_paterno} ${other.apellido_materno}, -- ${other.nrodocumento}</li>`;
        console.log(other);
      }
      await placeRepository.update(
        { id: place.id },
        { quota: place.quota - (grupo.length + 1) }
      );
    } else {
      await placeRepository.update(
        { id: place.id },
        { quota: place.quota - 1 }
      );
    }

    // const user = await userRepository.create(req.body);
    // const results = await userRepository.save(user);
    // return res.send(results);
    try {
      console.log("sending mail");
      await transporter.sendMail(
        {
          from:
            '"Proyecto Especial Juegos Panamericanos Lima 2019" noreply$lima2019.pe',
          //from: "msanroman@legado.gob.pe",
          to: rest.email,
          subject: "Confirmación de reserva Legado Panamericanos",
          //text: `Estimado/a ${rest.nombres}: Ud. ha sido confirmado`,
          html: `
            <p>Estimado/a ${rest.nombres}:</p>
            <p>Queda confirmada su presencia para la sede de ${place.place}, en el evento: ${place.name}, el día ${place.date} de ${place.hourBegin} a ${place.hourEnd}.</p>
            <p>Las siguientes personas han sido registradas:</p>
            <ul>
                ${list}
            </ul>
          `,
        },
        (err: any, info: any) => {
          console.log(err);
          // console.log(info.envelope);
          // console.log(info.messageId);
          // info.message.pipe(process.stdout);
        }
      );
    } catch (e) {
      console.log(e);
    }
    return res.send("done");
  });

  // start express server
  app.listen(8000);
});
