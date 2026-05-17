type HeaderReader = Pick<Headers, "get">;

export function getFormSubmissionIdentifier(headersList: HeaderReader) {
  const forwardedFor = headersList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headersList.get("x-real-ip")?.trim();
  const cfIp = headersList.get("cf-connecting-ip")?.trim();
  const userAgent = headersList.get("user-agent")?.trim();

  return forwardedFor || realIp || cfIp || (userAgent ? `ua:${userAgent}` : "anonymous");
}
