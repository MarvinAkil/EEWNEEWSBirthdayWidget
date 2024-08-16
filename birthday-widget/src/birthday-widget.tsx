

import React, { ReactElement } from "react";
import { BlockAttributes } from "widget-sdk";

/**
 * React Component
 */
export interface BirthdayWidgetProps extends BlockAttributes {
  
}

//API Abfrage
function fetchDataSync(apikey: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', "https://neews.eew-group.com/api/users?limit=1000&query=Erndtebr%C3%BCck", false);
  xhr.setRequestHeader("Authorization", `Basic ${apikey}`);
  xhr.send();
  if (xhr.status == 200) {
    return JSON.parse(xhr.responseText);
  } else {
    throw new Error("Request failed.");
  }
}


export const BirthdayWidget = ({ apikey, contentLanguage }: BirthdayWidgetProps): ReactElement => {
  if (apikey === undefined) {
    console.log("apikey undefined")
    return (<div></div>)
  } else {
    console.log(`apikey is ${apikey}`)
    const response = fetchDataSync(apikey as string)
    const resultFetch = response.data;
    console.log(resultFetch)

    let finalArray = []

    for (var i = 0; i < resultFetch.length; i++) {
      if (resultFetch[i].profile.geburtstag != undefined && resultFetch[i].profile.geburtstag.length == 10 && resultFetch[i].status == "activated") {
        finalArray.push(resultFetch[i])
      }
    }

    finalArray.sort((a, b) => {
      let datePartsA = a.profile.geburtstag.split('.'); // Datumsteile trennen
      let datePartsB = b.profile.geburtstag.split('.'); // Datumsteile trennen
      let dayA = parseInt(datePartsA[0]); // Tag extrahieren und in eine Zahl umwandeln
      let monthA = parseInt(datePartsA[1]); // Monat extrahieren und in eine Zahl umwandeln
      let dayB = parseInt(datePartsB[0]); // Tag extrahieren und in eine Zahl umwandeln
      let monthB = parseInt(datePartsB[1]); // Monat extrahieren und in eine Zahl umwandeln

      // Überprüfen, ob alle Teile des Datums gültige Zahlen sind
      if (isNaN(dayA) || isNaN(monthA) || isNaN(dayB) || isNaN(monthB)) {
        // Wenn ein Teil des Datums keine gültige Zahl ist, sortiere sie nach dem Profilnamen
        return a.profile.firstName.localeCompare(b.profile.firstName);
      }

      // Zuerst nach Monat sortieren, dann nach Tag, um den gleichen Monat zu gruppieren
      if (monthA !== monthB) {
        return monthB - monthA; // Absteigend nach Monat sortieren
      } else {
        return dayB - dayA; // Absteigend nach Tag sortieren innerhalb desselben Monats
      }
    });

    let targetBirthdays = []

    for (var i = 0; i < finalArray.length; i++) {

      // Trennen des Strings in Tag, Monat und Jahr
      var parts = finalArray[i].profile.geburtstag.split(".");
      var day = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var year = new Date().getFullYear();

      // Konvertierung des Datums in das Format "YYYY-MM-DD"
      var formattedDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

      // Konvertierung des Strings in ein Date-Objekt
      var date = new Date(formattedDate);

      // Aktuelles Datum
      var currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Hinzufügen von 7 Tagen zum aktuellen Datum
      var sevenDaysLater = new Date();
      sevenDaysLater.setDate(currentDate.getDate() + 7);

      // If-Abfrage, um zu prüfen, ob das Datum innerhalb der nächsten 7 Tage liegt
      if (date >= currentDate && date <= sevenDaysLater) {
        targetBirthdays.push({ "firstName": finalArray[i].profile.firstName, "lastName": finalArray[i].profile.lastName, "day": day.toString(), "month": month.toString() });
      }
    }

    targetBirthdays.sort((a, b) => {
      // Zuerst nach Monat sortieren
      if (a.month !== b.month) {
        return parseInt(a.month) - parseInt(b.month);
      }
      // Wenn die Monate gleich sind, nach Tag sortieren
      return parseInt(a.day) - parseInt(b.day);
    });

    let return_html: ReactElement[] = [];
    targetBirthdays.forEach((birthday) => {

      console.log(birthday);

      const newElement: ReactElement = (
        <div>       
          <ul>
            <li>
              <span>{`${birthday.firstName} ${birthday.lastName} ${birthday.day}.${birthday.month}` } </span>
            </li>
          </ul>
        </div>
      )

      return_html.push(newElement);

    });

    return (<div><h1>Herzlichen Glückwunsch!</h1>
          <br />{return_html}</div>)

    return (<div></div>)
  }
};

