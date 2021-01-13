const {  startOfMonth,  startOfWeek,  endOfMonth,  endOfWeek,  format,  differenceInSeconds,  addDays,  addMonths} = require("date-fns");
import { ptBR } from "date-fns/locale";

document.querySelectorAll("#schedules-new").forEach((page)=>{
	const form = page.querySelector("form");
	const input = page.querySelector("[name=schedule_at]");
	const button = form.querySelector("[type=submit]");
	input.addEventListener("change", (e)=>{
		
		if (e.target.value) {
			button.disabled = false;
		} else {
			button.disabled = true;
		}
		
	});

	form.addEventListener("submit", (e)=>{

		if (!page.querySelector("[name=schedule_at]").value) {
			e.preventDefault();
			button.disabled = true;
		}
	});
});

document.querySelectorAll(".calendar").forEach((calendar) => {
  const today = new Date();
  let startMonth = startOfMonth(today);
  let startAt = startOfWeek(startMonth); //Primeiro dia visível do calendário
  let endAt = endOfWeek(endOfMonth(today));

  const title = calendar.querySelector("h2");
  const days = calendar.querySelector(".days");
  const btnToday = calendar.querySelector(".btn-today");
  const btnPrev = calendar.querySelector(".btn-prev");
  const btnNext = calendar.querySelector(".btn-next");

  btnToday.addEventListener("click", (e) => {
	startMonth = startOfMonth(new Date());
	startAt = startOfWeek(startMonth); //Primeiro dia visível do calendário
	endAt = endOfWeek(endOfMonth(startMonth));
	render();
  });
  btnPrev.addEventListener("click", (e) => {
	startMonth = addMonths(startMonth, -1);
	startAt = startOfWeek(startMonth);
	endAt = endOfWeek(endOfMonth(startMonth));
	render();
  });
  btnNext.addEventListener("click", (e) => {
	startMonth = addMonths(startMonth, 1);
	startAt = startOfWeek(startMonth);
	endAt = endOfWeek(endOfMonth(startMonth));
	render();
  });

  const render = () => {
	title.innerHTML = format(startMonth, "MMMM yyyy", {
	  locale: ptBR,
	});
	days.innerHTML = "";
	let currentDay = new Date(startAt.getTime());

	while (differenceInSeconds(endAt, currentDay) > 0) {

	  const li = document.createElement("li");

	  li.innerHTML = format(currentDay, "d");
	  li.dataset.date = format(currentDay, "yyyy-MM-dd");

	  if (format(currentDay, "yyyyMMdd") < format(today, "yyyyMM")) {
		li.classList.add("month-prev");
		li.style.backgroundColor = "#CCC";
		li.style.cursor = "no-drop";
	  } else {
		if (format(currentDay, "yyyyMM") < format(startMonth, "yyyyMM")) {
			li.classList.add("month-prev");
		  } else if (format(currentDay, "yyyyMM") > format(startMonth, "yyyyMM")) {
			li.classList.add("month-next");
		  } else if (format(currentDay, "yyyyMMdd") === format(today, "yyyyMMdd")) {
			li.classList.add("active");
		  }
	
		  li.addEventListener("click", (e)=>{
			const target = e.target;
			
			const selected = calendar.querySelector(".selected");
			if (selected) {
			  selected.classList.remove("selected");
			}
			target.classList.add("selected");
	
			document.querySelector("[name=schedule_at]").value = target.dataset.date;
	
			const evt = document.createEvent("HTMLEvents");
	
			evt.initEvent("change", false, true); //inicio do event, se pode ser espalhado, se pode ser cancewlado
	
			document.querySelector("[name=schedule_at]").dispatchEvent(evt);
		  });
	  }

	  

	  days.append(li);

	  currentDay = addDays(currentDay, 1);
	}

  };

  render();
});
