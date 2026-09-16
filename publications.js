/* ============================================================
   REBL — publication data
   Add or edit publications here; index.html carries only the two
   containers these render into. Loaded before script.js, which then
   picks up the rendered cards for filtering and expand/collapse.
   ============================================================ */
(function () {
  "use strict";

  /* The nine highlighted papers, oldest first. `image` is a path under
     assets/pubs/ — until that file exists the thumbnail falls back to a
     neutral tile. `authors: null` renders the "to be added" placeholder.
     `imageNote` is a reminder of what artwork the card wants; it is not
     rendered. */
  const FEATURED = [
    {
      title: "Rapid Turning at High-Speed: Inspirations from the Cheetah’s Tail",
      authors: "<strong>A. Patel</strong>, M. Braae",
      venue: "IROS · 2013",
      image: "assets/publications/dima.png",
      imageNote: "Suggested image: Dima turning, ideally beside a cheetah turning."
    },
    {
      title: "Quasi-Steady-State Aerodynamics of the Cheetah Tail",
      authors: "<strong>A. Patel</strong>, E. Boje, C. Fisher, L. Louis, E. Lane",
      venue: "Biology Open · 2016",
      image: "assets/publications/aero-tail.png",
      imageNote: "Suggested image: Tail pelt in the wind tunnel or an aerodynamic force illustration."
    },
    {
      title: "Using DeepLabCut for 3D Markerless Pose Estimation Across Species and Behaviours",
      authors: "T. Nath, A. Mathis, A. C. Chen, <strong>A. Patel</strong>, M. Bethge, M. W. Mathis",
      venue: "Nature Protocols · 2019",
      image: "assets/publications/dlc-cheetah.png",
      imageNote: "Suggested image: the Nature Protocols cover or a clean 2D-keypoints-to-3D-skeleton figure."
    },
    {
      title: "Contact-Implicit Trajectory Optimization Using Orthogonal Collocation",
      authors: "<strong>A. Patel</strong>, S. L. Shield, S. Kazi, A. M. Johnson, L. T. Biegler",
      venue: "IEEE Robotics and Automation Letters · 2019",
      image: "assets/publications/contact-trajopt.png",
      imageNote: "Suggested image: a clean contact sequence or collocation trajectory, not equations."
    },
    {
      title: "AcinoSet: A 3D Pose Estimation Dataset and Baseline Models for Cheetahs in the Wild",
      authors: "D. Joska, L. Clark, N. Muramatsu, R. Jericevich, F. Nicolls, A. Mathis, <strong>A. Patel</strong>",
      venue: "ICRA · 2021",
      image: "assets/publications/acinoset.png",
      imageNote: "Suggested image: cheetah footage transitioning into 2D keypoints and a 3D skeleton."
    },
    {
      title: "Markerless 3D Kinematics and Force Estimation in Cheetahs",
      authors: "Z. da Silva, S. Shield, P. E. Hudson, A. M. Wilson, F. Nicolls, <strong>A. Patel</strong>",
      venue: "Scientific Reports · 2024",
      image: "assets/publications/cheetah-dynamics.png",
      imageNote: "Suggested image: skeleton plus ground-reaction-force arrows."
    },
    {
      title: "AeroDima: Cheetah-Inspired Aerodynamic Tail Design for Rapid Manoeuvrability",
      authors: "D. Bright, S. Shield, <strong>A. Patel</strong>",
      venue: "ICRA · 2024",
      image: "assets/publications/aero-dima.png",
      imageNote: "Suggested image: AeroDima or a close-up of the aerodynamic tail."
    },
    {
      title: "WildPose: A Long-Range 3D Wildlife Motion Capture System",
      authors: "N. Muramatsu, S. Shin, Q. Deng, A. Markham, <strong>A. Patel</strong>",
      venue: "Journal of Experimental Biology · 2025",
      image: "assets/publications/wildpose.png",
      imageNote: "Suggested image: giraffe, cheetah or other wildlife with long-range sensing geometry."
    },
    {
      title: "Remote Heart Rate Estimation of Canines Using a mmWave Radar and Depth Camera",
      authors: "N. Bowden, R. Gillette, S. Paine, <strong>A. Patel</strong>",
      venue: "IEEE Sensors Letters · 2025",
      image: "assets/publications/canines.png",
      imageNote: "Suggested image: canine with a subtle radar waveform and depth silhouette."
    },
  ];

  /* The searchable list below the filter bar — imported from the group's
     Google Scholar profile. Order is newest first. `links` and `bibtex` are
     optional; a paper without them simply renders neither. */
  const PAPERS = [
    {
      title: "Cheetahs Combine Head Pitch Stabilisation with Predictive Yaw Tracking during High-speed Pursuit",
      byline: "S Zhuang, K Norton, J Yu, D Kanoulas, A Patel",
      venue: "bioRxiv",
      year: 2026,
      kind: "preprint",
      tag: "Preprint",
      // links: [
      //   { label: "bioRxiv", href: "https://doi.org/10.64898/2026.09.03.748592" },
      // ],
    },
    {
      title: "Species-specific effects of spinal stiffness on gait and actuation-cost proxy in simulated cheetah and horse galloping",
      byline: "D Schütz, S Shield, A Patel",
      venue: "Journal of Biomechanics",
      year: 2026,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Using markerless motion capture to explore changes in tackle kinematics and load-based tackling technique proficiency",
      byline: "L Paul, Z Martins, D Davidow, G Rennie, A Patel, B Jones, S Whitehead, ...",
      venue: "Journal of sports sciences",
      year: 2026,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "WildDepth: A Multimodal Dataset for 3D Wildlife Perception and Depth Estimation",
      byline: "M Aamir, N Muramatsu, S Shin, M Wijers, JX Zhong, X Hou, A Patel, ...",
      venue: "arXiv preprint",
      year: 2026,
      kind: "preprint",
      tag: "Preprint",
    },
    {
      title: "WildPose v2: A Compact Tri-Modal Platform for Long-Range Animal Motion Capture",
      byline: "GN Maswoswere, P Amayo, A Patel",
      venue: "IEEE Sensors Letters",
      year: 2026,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Development of force control and proprioception on a closed chain 5-segment leg",
      byline: "G Foster, A Patel, S Shield",
      venue: "MATEC Web of Conferences",
      year: 2025,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "M2S2: A Multimodal Sensor System for Remote Animal Motion Capture in the Wild",
      byline: "A Vally, G Maswoswere, N Bowden, S Paine, P Amayo, A Markham, ...",
      venue: "IEEE Sensors Letters",
      year: 2025,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "mmDiffusion: mmWave diffusion for sequential 3D human dense point cloud generation",
      byline: "Q Xie, X Hou, Q Deng, A Patel, N Trigoni, A Markham",
      venue: "2025 International Conference on 3D Vision (3DV)",
      year: 2025,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Optimal spine morphology for high-speed bounding in quadruped robots",
      byline: "S Abiodun, S Shield, A Patel, R Govender, H Wimberley",
      venue: "MATEC Web of Conferences",
      year: 2025,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Remote Heart Rate Estimation of Canines Using a Mmwave Radar and Depth Camera",
      byline: "N Bowden, R Gillette, S Paine, A Patel",
      venue: "IEEE Sensors Letters",
      year: 2025,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "WildPose: a long-range 3D wildlife motion capture system",
      byline: "N Muramatsu, S Shin, Q Deng, A Markham, A Patel",
      venue: "Journal of Experimental Biology",
      year: 2025,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "AeroDima: Cheetah-inspired aerodynamic tail design for rapid maneuverability",
      byline: "D Bright, S Shield, A Patel",
      venue: "2024 IEEE International Conference on Robotics and Automation (ICRA)",
      year: 2024,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Markerless 3D kinematics and force estimation in cheetahs",
      byline: "Z da Silva, S Shield, PE Hudson, AM Wilson, F Nicolls, A Patel",
      venue: "Scientific Reports",
      year: 2024,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Monocular 3D Reconstruction of Cheetahs in the Wild",
      byline: "Z Da Silva, Z Parkar, N Muramatsu, F Nicolls, A Patel",
      venue: "2024 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2024,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Motion capture system and method",
      byline: "A PATEL",
      venue: "US patent",
      year: 2024,
      kind: "patent",
      tag: "Patent",
    },
    {
      title: "Tail Use for Postural Stabilization in Captive Cheetahs during Routine Transportation",
      byline: "S Shield, G Foster, A Valley, N Muramatsu, A Jusufi, A Patel",
      venue: "INTEGRATIVE AND COMPARATIVE BIOLOGY",
      year: 2024,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Toward noncontact muscle activity estimation using FMCW radar",
      byline: "K Tsengwa, S Paine, F Nicolls, Y Albertus, A Patel",
      venue: "IEEE Sensors Journal",
      year: 2024,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Towards multi-modal animal pose estimation: A survey and in-depth analysis",
      byline: "Q Deng, O Deb, A Patel, C Rupprecht, P Torr, N Trigoni, A Markham",
      venue: "arXiv preprint",
      year: 2024,
      kind: "preprint",
      tag: "Preprint",
    },
    {
      title: "Towards multi-modal animal pose estimation: An in-depth analysis",
      byline: "Q Deng, O Deb, A Patel, C Rupprecht, P Torr, N Trigoni, A Markham",
      venue: "arXiv preprint",
      year: 2024,
      kind: "preprint",
      tag: "Preprint",
    },
    {
      title: "WILDPOSE: ALONG-RANGE 3D WILDLIFE MOTION CAPTURE",
      byline: "N Muramatsu, S Shin, Q Deng, A Markham, A Patel",
      venue: "—",
      year: 2024,
      kind: "other",
      tag: "Other",
    },
    {
      title: "Chasing the cheetah: how field biomechanics has evolved to keep up with the fastest land animal",
      byline: "S Shield, N Muramatsu, Z Da Silva, A Patel",
      venue: "Journal of Experimental Biology",
      year: 2023,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Creating Improved Conservation Reintroductions using observational biomechanics of the Cheetah",
      byline: "A Schulz, A Patel, A Jusufi",
      venue: "INTEGRATIVE AND COMPARATIVE BIOLOGY",
      year: 2023,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "From Dima to Kemba: Ten years of cheetah-inspired research at the African robotics unit",
      byline: "S Shield, A Patel",
      venue: "Scientific African",
      year: 2023,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Getting air: Modelling and control of a hybrid pneumatic-electric legged robot",
      byline: "C Mailer, S Shield, R Govender, A Patel",
      venue: "2023 IEEE International Conference on Robotics and Automation (ICRA)",
      year: 2023,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "mmpoint: Dense human point cloud generation from mmwave",
      byline: "Q Xie, Q Deng, TY Cheng, P Zhao, A Patel, N Trigoni, A Markham",
      venue: "Proceedings of 34th British Machine Vision Conference BMVC 2023",
      year: 2023,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Wild Motion Unleashed: Markerless 3D Kinematics and Force Estimation in Cheetahs",
      byline: "Z da Silva, S Shield, PE Hudson, AM Wilson, F Nicolls, A Patel",
      venue: "arXiv preprint",
      year: 2023,
      kind: "preprint",
      tag: "Preprint",
    },
    {
      title: "Wild Tech: Exploring South Africa’s unique robotics landscape",
      byline: "S Shield, R Verrinder, P Amayo, J Mwangama, A Patel",
      venue: "Science Robotics",
      year: 2023,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Contact-implicit direct collocation with a discontinuous velocity state",
      byline: "S Shield, AM Johnson, A Patel",
      venue: "IEEE Robotics and Automation Letters",
      year: 2022,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Ground reaction force plate apparatus and measurement system",
      byline: "A PATEL, C FISHER, LJ CLARK, J TEVERSHAM",
      venue: "US patent application",
      year: 2022,
      kind: "patent",
      tag: "Patent",
    },
    {
      title: "Improving 3d markerless pose estimation of animals in the wild using low-cost cameras",
      byline: "N Muramatsu, Z da Silva, D Joska, F Nicolls, A Patel",
      venue: "2022 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2022,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Minor change, major gains II: Are maximal coordinates the fastest choice for trajectory optimization?",
      byline: "S Shield, A Patel",
      venue: "2022 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2022,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Quantifying collision frequency and intensity in rugby union and rugby sevens: a systematic review",
      byline: "L Paul, M Naughton, B Jones, D Davidow, A Patel, M Lambert, ...",
      venue: "Sports medicine-open",
      year: 2022,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Acinoset: a 3d pose estimation dataset and baseline models for cheetahs in the wild",
      byline: "D Joska, L Clark, N Muramatsu, R Jericevich, F Nicolls, A Mathis, ...",
      venue: "2021 IEEE international conference on robotics and automation (ICRA)",
      year: 2021,
      kind: "conference",
      tag: "Conference",
      links: [
        { label: "arXiv", href: "https://arxiv.org/abs/2103.13282" },
      ],
      bibtex: `@inproceedings{joska2021acinoset,
  title     = {{AcinoSet}: A 3D Pose Estimation Dataset and Baseline Models for Cheetahs in the Wild},
  author    = {Joska, Daniel and Clark, Liam and Muramatsu, Naoya and Jericevich, Ricardo and Nicolls, Fred and Mathis, Alexander and Patel, Amir},
  booktitle = {IEEE International Conference on Robotics and Automation},
  year      = {2021}
}`,
    },
    {
      title: "Automated tackle injury risk assessment in contact-based sports-a rugby union example",
      byline: "Z Martin, S Hendricks, A Patel",
      venue: "2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition",
      year: 2021,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Cheetah tail behavior during pursuit",
      byline: "A Patel, R Jericevich, A Knemeyer, A Jusufi",
      venue: "Society of Integrative and Comparative Biology",
      year: 2021,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Enabling dynamic behaviors with aerodynamic drag in lightweight tails",
      byline: "J Norby, JY Li, C Selby, A Patel, AM Johnson",
      venue: "IEEE Transactions on Robotics",
      year: 2021,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Future tail tales: a forward-looking, integrative perspective on tail research",
      byline: "MJ Schwaner, ST Hsieh, I Braasch, S Bradley, CB Campos, CE Collins, ...",
      venue: "Integrative and Comparative Biology",
      year: 2021,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Leveraging Aerodynamic Drag for Tails in Legged Robot Locomotion",
      byline: "J Norby, JY Li, C Selby, A Patel, A Johnson",
      venue: "APS March Meeting Abstracts",
      year: 2021,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "On the optimal spine morphology of rapidly accelerating quadrupeds",
      byline: "C Fisher, A Patel",
      venue: "SAIEE Africa Research Journal",
      year: 2021,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Optimization-inspired controller design for transient legged locomotion",
      byline: "C Fisher, J Van Zyl, R Govender, A Patel",
      venue: "2021 IEEE International Conference on Robotics and Automation (ICRA)",
      year: 2021,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "SAIEE Africa Research Journal",
      byline: "C Fisher, A Patel, E Mugume, A Tumwesigyez, A Muhangi",
      venue: "—",
      year: 2021,
      kind: "other",
      tag: "Other",
    },
    {
      title: "Tails, flails, and sails: how appendages improve terrestrial maneuverability by improving stability",
      byline: "S Shield, R Jericevich, A Patel, A Jusufi",
      venue: "Integrative and comparative biology",
      year: 2021,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Baleka: A Bipedal Robot for Studying Rapid Maneuverability",
      byline: "C Fisher, B Blom, Alexander, A Patel",
      venue: "Frontiers in Mechanical Engineering",
      year: 2020,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Kinematic State Estimation Using Multiple DGPS/MEMS-IMU Sensors",
      byline: "A Patel",
      venue: "IEEE Sensors Letters",
      year: 2020,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Minor Change, Major Gains: The Effect of Orientation Formulation on Solving Time for Multi-body Trajectory Optimization",
      byline: "A Knemeyer, SL Shield, A Patel",
      venue: "IEEE Robotics and Automation Letters",
      year: 2020,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "On the effectiveness of silly walks as initial guesses for optimal legged locomotion problems",
      byline: "S Shield, A Patel",
      venue: "2020 International SAUPEC/RobMech/PRASA Conference",
      year: 2020,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "The ollie: A case study in trajectory optimization with varied contacts",
      byline: "N Anderson, S Shield, A Patel",
      venue: "2020 International SAUPEC/RobMech/PRASA Conference",
      year: 2020,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Waste Not, Want Not: Lessons in Rapid Quadrupedal Gait Termination from Thousands of Suboptimal Solutions",
      byline: "S Shield, A Patel",
      venue: "Intelligent Robots and Systems (IROS), 2020 IEEE/RSJ International Conference on",
      year: 2020,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "A review of robotics research in South Africa",
      byline: "E Boje, RL Christopher, J Fernandes, JH Hepworth, RB Kuriakose, ...",
      venue: "R&D Journal",
      year: 2019,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Contact-implicit trajectory optimization using orthogonal collocation",
      byline: "A Patel, SL Shield, S Kazi, AM Johnson, LT Biegler",
      venue: "IEEE Robotics and Automation Letters",
      year: 2019,
      kind: "journal",
      tag: "Journal",
      bibtex: `@article{patel2019contact,
  title   = {Contact-implicit trajectory optimization using orthogonal collocation},
  author  = {Patel, Amir and Shield, Stacey L. and Kazi, Shameeq and Johnson, Aaron M. and Biegler, Lorenz T.},
  journal = {IEEE Robotics and Automation Letters},
  year    = {2019}
}`,
    },
    {
      title: "Do intermediate gaits matter when rapidly accelerating?",
      byline: "C Fisher, C Hubicki, A Patel",
      venue: "IEEE Robotics and Automation Letters",
      year: 2019,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Effects of limb morphology on transient locomotion in quadruped robots",
      byline: "L Raw, C Fisher, A Patel",
      venue: "2019 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2019,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Using DeepLabCut for 3D markerless pose estimation across species and behaviors",
      byline: "T Nath, A Mathis, AC Chen, A Patel, M Bethge, MW Mathis",
      venue: "Nature Protocols",
      year: 2019,
      kind: "journal",
      tag: "Journal",
      bibtex: `@article{nath2019deeplabcut,
  title   = {Using {DeepLabCut} for 3D markerless pose estimation across species and behaviors},
  author  = {Nath, Tanmay and Mathis, Alexander and Chen, An Chi and Patel, Amir and Bethge, Matthias and Mathis, Mackenzie Weygandt},
  journal = {Nature Protocols},
  year    = {2019}
}`,
    },
    {
      title: "Investigation of a Bipedal Platform for Rapid Acceleration and Braking Manoeuvres",
      byline: "A Blom, A Patel",
      venue: "Robotics and Automation (ICRA), 2018 IEEE International Conference on",
      year: 2018,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Low-cost Three Axis Force Plate using Machine Learning",
      byline: "J Teversham, A Patel, MC Fisher",
      venue: "—",
      year: 2018,
      kind: "other",
      tag: "Other",
    },
    {
      title: "Rapid Gait Termination in Humanoids on Surfaces of Varying Friction",
      byline: "S Shield, A Patel",
      venue: "INTEGRATIVE AND COMPARATIVE BIOLOGY",
      year: 2018,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Tail Aerodynamics in Cheetahs and Robots",
      byline: "A Patel, P Suhrcke, A Zeloof, P Li, C Selby, A Johnson",
      venue: "—",
      year: 2018,
      kind: "other",
      tag: "Other",
    },
    {
      title: "Balancing stability and maneuverability during rapid gait termination in fast biped robots",
      byline: "S Shield, A Patel",
      venue: "2017 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2017,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "The effect of spine morphology on rapid acceleration in quadruped robots",
      byline: "C Fisher, S Shield, A Patel",
      venue: "2017 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2017,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Tracking the Cheetah Tail and Spine using Animal-borne Cameras and a Wireless Sensor Network",
      byline: "A Patel, C Fisher, B Stocks, F Nicolls, E Boje",
      venue: "Integrative and Comparative Biology",
      year: 2017,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Tracking the cheetah tail using animal-borne cameras, GPS, and an IMU",
      byline: "A Patel, B Stocks, C Fisher, F Nicolls, E Boje",
      venue: "IEEE Sensors Letters",
      year: 2017,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "Minimum time sprinting from rest in a planar quadruped",
      byline: "NF Steenkamp, A Patel",
      venue: "2016 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2016,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Quasi-steady state aerodynamics of the cheetah tail",
      byline: "A Patel, E Boje, C Fisher, L Louis, E Lane",
      venue: "Biology Open",
      year: 2016,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "A spider-inspired dragline enables aerial pitch righting in a mobile robot",
      byline: "S Shield, C Fisher, A Patel",
      venue: "Intelligent Robots and Systems (IROS), 2015 IEEE/RSJ International",
      year: 2015,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "On the Conical Motion and Aerodynamics of the Cheetah Tail",
      byline: "A Patel, E Boje",
      venue: "Robotics: Science and Systems (RSS) 2015 - Workshop",
      year: 2015,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "On the conical motion of a two-degree-of-freedom tail inspired by the cheetah",
      byline: "A Patel, E Boje",
      venue: "IEEE Transactions on Robotics",
      year: 2015,
      kind: "journal",
      tag: "Journal",
      bibtex: `@article{patel2015conical,
  title   = {On the Conical Motion of a Two-Degree-of-Freedom Tail Inspired by the Cheetah},
  author  = {Patel, Amir and Boje, Edward},
  journal = {IEEE Transactions on Robotics},
  year    = {2015}
}`,
    },
    {
      title: "Understanding the motions of the cheetah tail using robotics",
      byline: "A Patel",
      venue: "—",
      year: 2015,
      kind: "other",
      tag: "Other",
    },
    {
      title: "An actuated tail increases rapid acceleration manoeuvres in quadruped robots",
      byline: "A Patel, M Braae",
      venue: "Innovations and Advances in Computing, Informatics, Systems Sciences",
      year: 2014,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "FlipBot: A Lizard Inspired Stunt Robot",
      byline: "C Fisher, A Patel",
      venue: "—",
      year: 2014,
      kind: "other",
      tag: "Other",
    },
    {
      title: "Rapid acceleration and braking: Inspirations from the cheetah's tail",
      byline: "A Patel, M Braae",
      venue: "Robotics and Automation (ICRA), 2014 IEEE International Conference on",
      year: 2014,
      kind: "conference",
      tag: "Conference",
    },
    {
      title: "Rapid turning at high-speed: Inspirations from the cheetah's tail",
      byline: "A Patel, M Braae",
      venue: "2013 IEEE/RSJ International Conference on Intelligent Robots and Systems",
      year: 2013,
      kind: "conference",
      tag: "Conference",
      bibtex: `@inproceedings{patel2013rapid,
  title     = {Rapid turning at high-speed: Inspirations from the cheetah's tail},
  author    = {Patel, Amir and Braae, Mark},
  booktitle = {IEEE/RSJ International Conference on Intelligent Robots and Systems},
  year      = {2013}
}`,
    },
    {
      title: "UAV collision avoidance: A specific acceleration matching control approach",
      byline: "A Patel, S Winberg",
      venue: "IEEE Africon",
      year: 2011,
      kind: "journal",
      tag: "Journal",
    },
    {
      title: "The Dynamic Control of Head Stabilisation in Cheetahs: A Computer Vision and Optimisation Approach",
      byline: "K Norton, S Shield, A Patel",
      venue: "—",
      year: null,
      kind: "other",
      tag: "Other",
    },
    {
      title: "UAV Collision Avoidance",
      byline: "A Patel",
      venue: "—",
      year: null,
      kind: "other",
      tag: "Other",
    },
  ];

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const attr = (s) => esc(s).replace(/"/g, "&quot;");

  function featuredCard(p) {
    const authors = p.authors
      ? '<p class="authors">' + p.authors + "</p>"
      : '<p class="authors todo">Authors — to be added</p>';
    return (
      '<article class="pub-card">' +
      '<span class="expand-icon">▾</span>' +
      '<div class="thumb"><img src="' + attr(p.image) + '" alt="" loading="lazy" /></div>' +
      '<div class="info">' +
      "<h3>" + esc(p.title) + "</h3>" +
      authors +
      '<p class="venue">' + esc(p.venue) + "</p>" +
      "</div></article>"
    );
  }

  function paperArticle(p) {
    const links = (p.links || [])
      .map((l) => '<a class="small-link" href="' + attr(l.href) + '">' + esc(l.label) + "</a>")
      .join("");
    const venue = p.venue + (p.year ? " · " + p.year : "");
    return (
      '<article class="pub" data-year="' + (p.year || "") + '" data-kind="' + attr(p.kind) + '">' +
      '<div class="top"><div>' +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="byline">' + esc(p.byline) + "</p>" +
      '<p class="venue">' + esc(venue) + "</p>" +
      "</div>" +
      '<span class="tag"><span class="pin"></span>' + esc(p.tag) + "</span>" +
      "</div>" +
      (links ? '<div class="links">' + links + "</div>" : "") +
      (p.bibtex
        ? '<details class="bib"><summary>BibTeX</summary><pre>' + esc(p.bibtex) + "</pre></details>"
        : "") +
      "</article>"
    );
  }

  function chip(attrName, value, label) {
    return '<button class="chipbtn" data-' + attrName + '="' + attr(value) + '" aria-pressed="false">' +
      esc(label) + "</button>";
  }

  const featuredHost = document.querySelector(".pub-featured");
  if (featuredHost) featuredHost.innerHTML = FEATURED.map(featuredCard).join("");

  const listHost = document.querySelector(".pub-list");
  if (listHost) listHost.innerHTML = PAPERS.map(paperArticle).join("");

  /* Filter chips are built from the data so they can never drift out of sync
     with the papers actually listed. */
  const yearHost = document.querySelector("#pubYears");
  if (yearHost) {
    const years = [...new Set(PAPERS.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a);
    yearHost.innerHTML =
      chip("year", "all", "All years") + years.map((y) => chip("year", String(y), String(y))).join("");
  }

  const typeHost = document.querySelector("#pubTypes");
  if (typeHost) {
    const seen = new Map();
    PAPERS.forEach((p) => seen.set(p.kind, p.tag));
    const order = ["journal", "conference", "preprint", "patent", "other"];
    const kinds = order.filter((k) => seen.has(k));
    typeHost.innerHTML =
      chip("type", "all", "All types") + kinds.map((k) => chip("type", k, seen.get(k))).join("");
  }
})();
