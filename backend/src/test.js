String.stringContains(user.email, '@forcepointgov.com')
  ? hasWorkdayUser()
    ? String.join('', findWorkdayUser().managerUserName, '@websense.com')
    : String.join('', findWorkdayUser().managerUserName, '@forcepoint.com')
  : String.join('', findWorkdayUser().managerUserName, '@forcepoint.com');
