import { Cuestionario } from "./local/cuestionario";
import { CuestionarioEmpleado } from "./local/cuestionarioempleado";
import { eachDayOfInterval, getDay, add, sub } from "date-fns";

// const setTZ = require("set-tz");
// setTZ("UTC");

import SMTPTransport from "nodemailer/lib/smtp-transport";
const express = require("express");
import { Request, Response } from "express";
import { Column, createConnection } from "typeorm";
import { MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { Place } from "./local/place";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Reserva } from "./local/reserva";
import moment from "moment";
import fileUpload, { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

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
  app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  );

  // register routes
  app.get("/reset", async function (req: Request, res: Response) {
    const days = eachDayOfInterval({
      start: new Date(2021, 0, 19),
      end: new Date(2021, 4, 31),
    });

    let lun: Array<{ date: string; day: string }> = [];
    let mar: Array<{ date: string; day: string }> = [];
    let mie: Array<{ date: string; day: string }> = [];
    let jue: Array<{ date: string; day: string }> = [];
    let vie: Array<{ date: string; day: string }> = [];
    let sab: Array<{ date: string; day: string }> = [];
    let dom: Array<{ date: string; day: string }> = [];

    for (let day of days) {
      let copy = add(day, {
        days: 1,
      });
      console.log(copy.toISOString());
      switch (getDay(day)) {
        case 0:
          dom.push({ date: copy.toISOString(), day: "Domingo" });
          break;
        case 1:
          lun.push({ date: copy.toISOString(), day: "Lunes" });
          break;
        case 2:
          mar.push({ date: copy.toISOString(), day: "Martes" });
          break;
        case 3:
          mie.push({ date: copy.toISOString(), day: "Miércoles" });
          break;
        case 4:
          jue.push({ date: copy.toISOString(), day: "Jueves" });
          break;
        case 5:
          vie.push({ date: copy.toISOString(), day: "Viernes" });
          break;
        case 6:
          sab.push({ date: copy.toISOString(), day: "Sábado" });
          break;
      }
    }

    // here we will have logic to return all users
    let config = [
      {
        place: "Villa María del Triunfo",
        name: "Plaza de las Banderas",
        dates: [mie, vie, dom],
        quota: 70,
        low: 1,
        hi: 70,
        group: "f",
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
        door: "VMZP05X",
      },
      {
        place: "Villa María del Triunfo",
        name: "Tenis Cancha 01",
        dates: [mar, jue, sab],
        quota: 4,
        low: 2,
        hi: 4,
        group: "t",
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
        name: "Tenis Cancha 02",
        dates: [mar, jue, sab],
        quota: 4,
        low: 2,
        hi: 4,
        group: "t",
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
        name: "Atletismo",
        dates: [mar, jue, sab],
        quota: 60,
        low: 1,
        hi: 60,
        group: "f",
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
        name: "Ciclismo",
        dates: [mar, jue, sab],
        quota: 15,
        low: 1,
        hi: 15,
        group: "f",
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
        name: "Cancha Fútbol Net",
        dates: [mie, vie, dom],
        quota: 4,
        low: 2,
        hi: 4,
        group: "t",
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
        door: "VMZP05X",
      },
      {
        place: "Villa María del Triunfo",
        name: "Cancha Voleibol",
        dates: [mie, vie, dom],
        quota: 4,
        low: 2,
        hi: 4,
        group: "t",
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
        door: "VMZP05X",
      },
      {
        place: "Villa María del Triunfo",
        name: "Cancha de Danza",
        dates: [mie, vie, dom],
        quota: 25,
        low: 4,
        hi: 25,
        group: "t",
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
        door: "VMZP05X",
      },
    ];
    try {
      console.log("reset");
      for (let i = 0; i < config.length; i++) {
        for (let j = 0; j < config[i].dates.length; j++) {
          for (let k = 0; k < config[i].dates[j].length; k++) {
            for (let l = 0; l < config[i].hoursBegin.length; l++) {
              await placeRepository.insert({
                place: config[i].place,
                name: config[i].name,
                date: config[i].dates[j][k].date,
                quota: config[i].quota,
                hourBegin: config[i].hoursBegin[l],
                hourEnd: config[i].hoursEnd[l],
                day: config[i].dates[j][k].day,
                door: config[i].door,
                low: config[i].low,
                hi: config[i].hi,
                group: config[i].group,
              });
            }
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

    let _time =
      date_ob.getHours() +
      ":" +
      date_ob.getMinutes() +
      ":" +
      date_ob.getSeconds();

    let { quota, ...rest } = req.query;
    // @ts-ignore
    //rest.date = MoreThanOrEqual(_date);

    if (quota) {
      console.log(quota);
      // @ts-ignore
      rest.quota = MoreThanOrEqual(quota);
    }

    let now = new Date();

    let lo_date = sub(now, {
      days: 1,
    });

    let hi_date = add(now, {
      days: 1,
    });

    console.log(lo_date);
    console.log(hi_date);
    // @ts-ignore
    rest.date = Between(lo_date, hi_date);

    let places = await placeRepository.find({
      where: rest,
    });

    res.json(places);
  });

  app.post("/reclamo", async function (req: Request, res: Response) {});

  app.post("/file", async function (req: Request, res: Response) {
    console.log(req.files);
    let sampleFile: any;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    if (req.files.length) {
      sampleFile = req.files[0];
    } else {
      sampleFile = req.files.file;
    }
    console.log(sampleFile.name);
    let extension = sampleFile.name.split(".");
    extension = extension[extension.length - 1];
    extension = uuidv4() + "." + extension;
    uploadPath = __dirname + "/upload/" + extension;
    //
    // // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err: any) {
      if (err) return res.status(500).send(err);
      res.send({ original: sampleFile.name, coded: extension });
    });
  });

  app.post("/reservas", async function (req: Request, res: Response) {
    let { grupo, event_id, ...rest } = req.body;

    console.log("REQ");
    console.log(req.body);

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
      if (place.group === "t") {
        await placeRepository.update({ id: place.id }, { quota: 0 });
      } else {
        await placeRepository.update(
          { id: place.id },
          { quota: place.quota - (grupo.length + 1) }
        );
      }
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
            '"Proyecto Especial Juegos Panamericanos Lima 2019" noreply@lima2019.pe',
          //from: "msanroman@legado.gob.pe",
          to: rest.email,
          subject: "Confirmación de reserva Legado Panamericanos",
          //text: `Estimado/a ${rest.nombres}: Ud. ha sido confirmado`,
          html: `
            <p>Estimado/a ${rest.nombres}:</p>
            <p>Queda confirmado su registro para ${place.place}, en la actividad deportiva ${place.name}, el día ${place.date} de ${place.hourBegin} a ${place.hourEnd}.</p>
            <p>Las siguientes personas han sido registradas:</p>
            <ul>
                ${list}
            </ul>
             Recuerda para ingresar a la sede: 
            <ul>
              <li>Debes usar mascarilla correctamente y de manera permanente.</li> 
              <li>Llevar su DNI y el de sus acompañantes.</li>
              <li>Cuentas con 30 minutos de tolerancia. </li>
              <li>Se recomienda asistir con zapatillas.</li>
            <ul> 
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
