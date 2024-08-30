module.exports = {
	BookRoom: function (roomEmail, roomName, startTime, endTime, bookingType) {
  
	  const ews = require("ews-javascript-api");
	  const auth = require("../../config/auth/auth.js");
	  const moment = require('moment');
	  const https = require('https');
  
	  const exch = new ews.ExchangeService(ews.ExchangeVersion.Exchange2016); // Explicitly set Exchange 2016
	  exch.Credentials = new ews.WebCredentials(auth.exchange.username, auth.exchange.password);
	  exch.Url = new ews.Uri(config.exchange.uri);
  
	  if ((bookingType === 'BookNow') || (bookingType === 'BookAfter')) {
		console.log("BookNow/BookAfter");
		const appointment = new ews.Appointment(exch);
		appointment.Subject = "Booked by Meet-Easier";
		appointment.Start = new ews.DateTime(startTime);
		appointment.End = new ews.DateTime(endTime);
		console.log("RoomBooking: " + appointment.Start + " | " + appointment.End);
		appointment.Location = roomName;
		appointment.Body = new ews.MessageBody(ews.BodyType.HTML, "Room Booked by Room Panel");
		appointment.RequiredAttendees.Add(roomEmail);
		const mode = ews.SendInvitationsMode.SendToAllAndSaveCopy;
		appointment.Save(mode).then(() => {
		  console.log("Appointment Saved");
		}).catch((ei) => {
		  console.error(ei.stack, ei.stack.split("\n"));
		  console.log("error");
		});
	  } else if ((bookingType === 'Extend') || (bookingType === 'EndNow')) {
		const calendarFolderId = new ews.FolderId(ews.WellKnownFolderName.Calendar, new ews.Mailbox(roomEmail));
		const view = new ews.CalendarView(ews.DateTime.Now, new ews.DateTime(ews.DateTime.Now.TotalMilliSeconds + 576000000), 6);
		exch.FindAppointments(calendarFolderId, view).then((response) => {
		  const appointments = response.Items;
		  console.log(bookingType + ":START");
		  appointments.forEach((appt) => {
			const start = processTime(appt.Start.momentDate);
			const end = processTime(appt.End.momentDate);
			const now = Date.now();
  
			const apptStart = new ews.DateTime(new Date(parseInt(start, 10)));
			const apptStartTime = moment(start).toISOString();
			if (apptStartTime === startTime) {
			  appt.End = new ews.DateTime(endTime);
			  const SIOCmode = ews.SendInvitationsOrCancellationsMode.SendToAllAndSaveCopy;
			  const CRmode = ews.ConflictResolutionMode.AlwaysOverwrite;
			  appt.Update(CRmode, SIOCmode).then(() => {
				console.log("Appointment Saved");
			  }).catch((ei) => {
				console.error(ei.stack, ei.stack.split("\n"));
				console.log("error");
			  });
			}
		  });
		}).catch((error) => {
		  console.log(error);
		});
	  }
  
	  function processTime(appointmentTime) {
		let time = JSON.stringify(appointmentTime).replace(/"/g, "");
		time = new Date(time).getTime();
		return time;
	  }
	}
  }
  