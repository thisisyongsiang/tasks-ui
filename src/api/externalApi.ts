export const fetchPublicHolidayData = async (
  countryCode: string,
  year: number
) => {
  const URL = `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const test=await res.json()
  return test;
};
