const isNavTogglerVisible = $('.navbar-toggler').is(':visible');

const tour = new Shepherd.Tour({
    useModalOverlay: true,
    debug: true,  
    defaultStepOptions: {
        modalOverlayOpeningPadding: 6,
        modalOverlayOpeningRadius: 15,
      cancelIcon: {
        enabled: true
      },
        classes: 'class-1 class-2',
        // scrollTo: { behavior: 'smooth', block: 'center' },
    }
  });
  
  tour.addStep({
    title: 'Welcome to NewsStack! (1/6)',
    text: `This is a news stack. News stacks display articles related to a specified topic. To read a full article, click on it.`,
    attachTo: {
      element: '.feedcolumn:first-child',
        on: 'right-start',
        vertical: 'top' 
    },
    buttons: [
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  
  tour.addStep({
    title: 'Welcome to NewsStack! (2/6)',
    text: `You can change the topic or delete stacks using the buttons on the top.`,
    attachTo: {
      element: '.feedcolumn:first-child > div:nth-child(1) > div',
      on: 'right'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  
tour.addStep({
  title: 'Welcome to NewsStack! (3/6)',
  text: `Use the buttons on the top right of a news item to bookmark it or tick it as read and remove it from the list.`,
  attachTo: {
    element: ".feedcolumn:first-child > div.tab-content.p-0.border-0 > div.tab-pane.fade.show.active > div:nth-child(1) > div > div.col.d-flex > div > div:nth-child(1)",
    on: 'right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  id: 'creating'
});

  
tour.addStep({
  title: 'Welcome to NewsStack! (4/6)',
  text: `You can access your bookmarks and read articles anytime by using the tab bar at the top.`,
  attachTo: {
    element: '.feedcolumn:first-child > ul',
    on: 'right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  id: 'creating'
});

  tour.addStep({
    title: 'Welcome to NewsStack! (5/6)',
    text: `Create new stacks to specify and follow as many topics as you want.`,
    attachTo: {
      element: (isNavTogglerVisible ? '.navbar-toggler' : '#addnewsstackbtn'),
      on: 'left'
    },
    buttons: [
        {
          action() {
            return this.back();
          },
          classes: 'shepherd-button-secondary',
          text: 'Back'
        },
        {
          action() {
            return this.next();
          },
          text: 'Next'
        }
      ],
    id: 'creating'
  });

  tour.addStep({
    title: 'Welcome to NewsStack! (6/6)',
    text: `Sign up and login to save your news stacks and access them from any device.`,
    attachTo: {
      element: (isNavTogglerVisible ? '.navbar-toggler' : '#loginbtn'),
      on: 'left'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Finish'
      }
    ],
    id: 'creating'
  });
  

function startOnboardingTour() {
    var tourcompleted = getCookie("onboarding_tour_v0.01");

    if (!tourcompleted) {
        setTimeout(() => {
            tour.start();
        }, 2000);
        setCookie("onboarding_tour_v0.01", "done", 365);
    }

}

// Check if the device is not mobile
// if (!(/Mobi|Android/i.test(navigator.userAgent))) {
  // Call the function on non-mobile devices
  startOnboardingTour();
// }
