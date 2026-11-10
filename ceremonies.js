/* Wedding and funeral orders of service for LWH Daily Word.
   Traditional forms follow the public-domain Book of Common Prayer wording; modern forms are original.
   Tokens like {{Bride}} are filled in from the form. {{read:Psalms 23}} inserts that passage's text.
   Lines in [brackets] are notes to the officiant. */
const CER_FIELDS={
 wedding:[
  ['Groom','Groom’s full name',''],['Bride','Bride’s full name',''],
  ['Date','Wedding date',''],['Place','Church or venue',''],
  ['Giver','Who gives the bride (optional)','her father'],['State','State for the pronouncement','Arkansas'],
  ['Officiant','Officiant','']],
 funeral:[
  ['Name','Full name of the departed',''],['First','Name family uses (e.g. Bill, Mama Jo)',''],
  ['Pron','He or she','he'],['Born','Date of birth',''],['Died','Date of death',''],
  ['Family','Family left behind (one per line)',''],['Story','Life notes from the family visit',''],
  ['Place','Church or funeral home',''],['Officiant','Officiant','']]
};
const CER_HINT={Family:'e.g. His wife of 52 years, Martha\nSons David and Mark\nSeven grandchildren',
 Story:'Where they grew up, work, faith, church, hobbies, favorite sayings, what the family wants remembered'};
const CEREMONIES=[
/* ===================== WEDDINGS ===================== */
{id:'w1',kind:'wedding',style:'Traditional',title:'Traditional Christian Wedding',mins:'20–25 min',
 desc:'The classic church wedding in King James language: the charge, declaration of intent, giving of the bride, traditional vows and rings, prayer and pronouncement.',
 body:`THE MARRIAGE OF {{Groom}} AND {{Bride}}
{{Date}} · {{Place}}
Officiant: {{Officiant}}

[Prelude and seating of the families. The groom and groomsmen enter. Processional of the bridal party. The congregation stands as the bride enters.]

CALL TO WORSHIP AND CHARGE
Dearly beloved, we are gathered together here in the sight of God, and in the face of this company, to join together this man and this woman in holy matrimony; which is an honourable estate, instituted of God, signifying unto us the mystical union that is betwixt Christ and his Church; which holy estate Christ adorned and beautified with his presence and first miracle that he wrought in Cana of Galilee, and is commended of Saint Paul to be honourable among all men: and therefore is not by any to be entered into unadvisedly or lightly; but reverently, discreetly, soberly, and in the fear of God.

Into this holy estate these two persons present come now to be joined. If any man can shew any just cause, why they may not lawfully be joined together, let him now speak, or else hereafter for ever hold his peace.

[Pause. The congregation may be seated.]

PRAYER
Let us pray. Almighty God, our heavenly Father, we thank Thee for the gift of love and for the covenant of marriage. Bless {{BrideFirst}} and {{GroomFirst}} as they stand before Thee. Be present in this place, as Thou wast present at the wedding in Cana, and let this marriage bring honour to Thy name. In the name of Jesus Christ our Lord. Amen.

GIVING OF THE BRIDE
Who giveth this woman to be married to this man?
[{{Giver}} answers: "Her mother and I," or "I do." The bride's hand is given to the groom.]

SCRIPTURE
{{read:Genesis 2:18, 21-24}}
— Genesis 2

{{read:1 Corinthians 13:4-8}}
— 1 Corinthians 13

MESSAGE
[A short word to the couple, 5–7 minutes. Suggested text: Ecclesiastes 4:9-12, "a threefold cord is not quickly broken." Speak to Christ at the center of the home.]

DECLARATION OF INTENT
{{GroomFirst}}, wilt thou have this woman to thy wedded wife, to live together after God's ordinance in the holy estate of matrimony? Wilt thou love her, comfort her, honour and keep her, in sickness and in health; and, forsaking all other, keep thee only unto her, so long as ye both shall live?
[Groom: "I will."]

{{BrideFirst}}, wilt thou have this man to thy wedded husband, to live together after God's ordinance in the holy estate of matrimony? Wilt thou love him, comfort him, honour and keep him, in sickness and in health; and, forsaking all other, keep thee only unto him, so long as ye both shall live?
[Bride: "I will."]

VOWS
[The couple face each other and join right hands. They repeat after the officiant.]
I, {{GroomFirst}}, take thee, {{BrideFirst}}, to be my wedded wife, to have and to hold from this day forward, for better for worse, for richer for poorer, in sickness and in health, to love and to cherish, till death us do part, according to God's holy ordinance; and thereto I plight thee my troth.

I, {{BrideFirst}}, take thee, {{GroomFirst}}, to be my wedded husband, to have and to hold from this day forward, for better for worse, for richer for poorer, in sickness and in health, to love and to cherish, till death us do part, according to God's holy ordinance; and thereto I give thee my troth.

EXCHANGE OF RINGS
The ring is an outward and visible sign of an inward and spiritual grace, a circle without end, signifying unbroken love.
[Groom places the ring and repeats:] With this ring I thee wed, and with all my worldly goods I thee endow: in the name of the Father, and of the Son, and of the Holy Ghost. Amen.
[Bride places the ring and repeats the same.]

PRAYER OF BLESSING
O eternal God, Creator and Preserver of all mankind, Giver of all spiritual grace, the Author of everlasting life: send Thy blessing upon these Thy servants, this man and this woman, whom we bless in Thy name; that they may surely perform and keep the vow and covenant betwixt them made, and may ever remain in perfect love and peace together, and live according to Thy laws; through Jesus Christ our Lord. Amen.

[Optional: the Lord's Prayer, prayed together.]

PRONOUNCEMENT
Those whom God hath joined together let no man put asunder.
Forasmuch as {{GroomFirst}} and {{BrideFirst}} have consented together in holy wedlock, and have witnessed the same before God and this company, and thereto have given and pledged their troth either to other, and have declared the same by giving and receiving of a ring, and by joining of hands; by the authority vested in me as a minister of the gospel and by the State of {{State}}, I pronounce that they are man and wife, in the name of the Father, and of the Son, and of the Holy Ghost. Amen.

BENEDICTION
{{read:Numbers 6:24-26}}

You may kiss the bride.

PRESENTATION
It is my privilege to present to you Mr. and Mrs. {{Groom}}.
[Recessional.]

[After the service: sign the marriage license with the couple and two witnesses, and return it to the county clerk within the time the state requires.]`},
{id:'w2',kind:'wedding',style:'Modern',title:'Modern Christian Wedding',mins:'20–30 min',
 desc:'Warm, present-day language with room for personal vows, an optional unity candle or sand ceremony, and a Christ-centered message.',
 body:`THE WEDDING OF {{BrideFirst}} AND {{GroomFirst}}
{{Date}} · {{Place}}
Officiant: {{Officiant}}

[Seating of the families, processional. The congregation stands as the bride enters, then is seated.]

WELCOME
Good afternoon, and welcome. On behalf of {{BrideFirst}} and {{GroomFirst}}, thank you for being here. Every one of you has had a part in their story, and they wanted the people they love most to witness the promises they make today.

Marriage was God's idea. In the very beginning He said, "It is not good that the man should be alone," and He brought the first couple together Himself. Today we celebrate that same gift as {{BrideFirst}} and {{GroomFirst}} become husband and wife.

OPENING PRAYER
Heavenly Father, thank You for love, for family and for this day. We ask You to be at the center of this ceremony and at the center of this marriage. Fill this place with Your joy, and give {{GroomFirst}} and {{BrideFirst}} a home built on Your Word. In Jesus' name, amen.

GIVING OF THE BRIDE (optional)
Who presents this woman to be married to this man?
[{{Giver}}: "We do."]

SCRIPTURE READING
{{read:Colossians 3:12-17}}
— Colossians 3

[Optional second reading by a friend or family member: Ruth 1:16-17, or Ecclesiastes 4:9-12.]

MESSAGE TO THE COUPLE
[5–8 minutes. Possible outline:
 1. Love is a choice you make every day (1 Corinthians 13).
 2. Forgiveness is how love survives (Colossians 3:13).
 3. Christ in the middle makes a cord of three strands (Ecclesiastes 4:12).
 Add one personal story about the couple.]

DECLARATION OF INTENT
{{GroomFirst}}, do you take {{BrideFirst}} to be your wife? Will you love her, honor her, protect her and be faithful to her, in good times and in hard times, for as long as you both shall live?
[Groom: "I will."]

{{BrideFirst}}, do you take {{GroomFirst}} to be your husband? Will you love him, honor him, support him and be faithful to him, in good times and in hard times, for as long as you both shall live?
[Bride: "I will."]

VOWS
[Option A, repeated after the officiant:]
{{BrideFirst}}, I give you my love and my life. I promise to walk beside you, to pray with you and for you, to forgive you as Christ forgives me, and to keep my promise to you in every season, for as long as we both shall live.

{{GroomFirst}}, I give you my love and my life. I promise to walk beside you, to pray with you and for you, to forgive you as Christ forgives me, and to keep my promise to you in every season, for as long as we both shall live.

[Option B: the couple read vows they have written. Ask for a copy ahead of time.]

EXCHANGE OF RINGS
These rings are a circle, with no beginning and no end, a reminder of the unending love of God and of the promise you make today.
[Groom:] {{BrideFirst}}, I give you this ring as a sign of my love and faithfulness. Wear it and remember that I am yours.
[Bride:] {{GroomFirst}}, I give you this ring as a sign of my love and faithfulness. Wear it and remember that I am yours.

UNITY CANDLE OR SAND (optional)
[Candle: the mothers light the side candles at the beginning; the couple light the center candle together.]
[Sand: two colors poured into one vessel. They can never be separated again.]
Two lives, two families, now joined as one, with Christ as the light of their home.

PRAYER OF BLESSING
Lord, bless this husband and wife. Give them patience with each other, laughter in their home and faith that grows stronger every year. Protect their marriage from everything that would pull them apart. May their home be a place where You are honored and where others are welcomed. In Jesus' name, amen.

PRONOUNCEMENT
{{GroomFirst}} and {{BrideFirst}}, you have made your promises before God and these witnesses. By the authority vested in me by the State of {{State}}, and as a minister of the gospel of Jesus Christ, I now pronounce you husband and wife. What God has joined together, let no one separate.

{{GroomFirst}}, you may kiss your bride.

PRESENTATION
Friends and family, it is my joy to introduce for the first time, Mr. and Mrs. {{Groom}}.
[Recessional.]

[After the service: sign the marriage license with the couple and two witnesses, and return it to the county clerk within the time the state requires.]`},
{id:'w3',kind:'wedding',style:'Simple',title:'Short and Simple Ceremony',mins:'8–10 min',
 desc:'A brief, complete Christian ceremony for a small gathering, a home or a courthouse-style wedding.',
 body:`THE MARRIAGE OF {{BrideFirst}} AND {{GroomFirst}}
{{Date}} · {{Place}}

WELCOME
We are gathered here before God to join {{GroomFirst}} and {{BrideFirst}} in marriage, a covenant God Himself established and blesses. Jesus said, "Have ye not read, that he which made them at the beginning made them male and female, and said, For this cause shall a man leave father and mother, and shall cleave to his wife: and they twain shall be one flesh?"

PRAYER
Lord, bless this marriage and this home. Be the third strand in the cord that binds these two together. In Jesus' name, amen.

SCRIPTURE
{{read:Ecclesiastes 4:9-12}}

VOWS
{{GroomFirst}}, do you take {{BrideFirst}} to be your wife, to love and to cherish, in sickness and in health, forsaking all others, as long as you both shall live? ["I do."]
{{BrideFirst}}, do you take {{GroomFirst}} to be your husband, to love and to cherish, in sickness and in health, forsaking all others, as long as you both shall live? ["I do."]

RINGS
[Each says:] With this ring, I thee wed, and pledge my love and faithfulness to you.

PRONOUNCEMENT
By the authority vested in me by the State of {{State}}, I now pronounce you husband and wife. What God hath joined together, let not man put asunder. You may kiss the bride.

BLESSING
{{read:Numbers 6:24-26}}

[Sign the marriage license with the couple and two witnesses.]`},
{id:'w4',kind:'wedding',style:'Vow Renewal',title:'Renewal of Wedding Vows',mins:'15 min',
 desc:'For an anniversary celebration: thanksgiving for the years, renewed promises and a blessing over the marriage.',
 body:`A SERVICE OF THANKSGIVING AND RENEWAL OF VOWS
{{GroomFirst}} and {{BrideFirst}} · {{Date}} · {{Place}}

WELCOME
Years ago, {{GroomFirst}} and {{BrideFirst}} stood before God and made promises to each other. Today they come back, not to start something new, but to give thanks for what God has built and to say again, "I still choose you."

SCRIPTURE
{{read:Psalms 127:1}}
{{read:Lamentations 3:22-23}}

REFLECTION
[A few words about the couple's years together: the home they made, the children and grandchildren, the hard seasons God carried them through. Invite a child or grandchild to share a short memory.]

RENEWAL OF VOWS
{{GroomFirst}}, after all these years, do you renew your promise to love, honor and cherish {{BrideFirst}}, in sickness and in health, for as long as you both shall live? ["I do."]
{{BrideFirst}}, after all these years, do you renew your promise to love, honor and cherish {{GroomFirst}}, in sickness and in health, for as long as you both shall live? ["I do."]

[Optional: the couple speak a few words to each other in their own way.]

BLESSING OF THE RINGS
Lord, bless these rings, worn through many years. Let them remind {{GroomFirst}} and {{BrideFirst}} of promises kept and of Your faithfulness that has kept them. Amen.

PRAYER
Father, thank You for this marriage. Thank You for every year, every answered prayer and every hard day You carried them through. Bless the years ahead with health, joy and peace. Let their marriage keep pointing others to You. In Jesus' name, amen.

BENEDICTION
{{read:Numbers 6:24-26}}`},
/* ===================== FUNERALS ===================== */
{id:'f1',kind:'funeral',style:'Traditional',title:'Traditional Funeral Service',mins:'30–40 min',
 desc:'The historic Christian funeral: opening sentences, Psalms, the Lord’s Prayer, obituary, message of hope, and the committal in King James language.',
 body:`A SERVICE OF WITNESS TO THE RESURRECTION
In Memory of {{Name}}
{{Born}} – {{Died}}
{{Place}} · Officiant: {{Officiant}}

[Prelude. The family is seated. The congregation stands as the officiant leads the procession.]

OPENING SENTENCES
I am the resurrection, and the life, saith the Lord: he that believeth in me, though he were dead, yet shall he live: and whosoever liveth and believeth in me shall never die.
I know that my redeemer liveth, and that he shall stand at the latter day upon the earth.
We brought nothing into this world, and it is certain we can carry nothing out. The LORD gave, and the LORD hath taken away; blessed be the name of the LORD.

[The congregation may be seated.]

INVOCATION
Let us pray. Almighty God, the God of all comfort, we come before Thee in sorrow, yet not as those who have no hope. Thou art our refuge and strength, a very present help in trouble. Comfort this family. Speak peace to every grieving heart, and help us to hear Thy Word today. Through Jesus Christ our Lord. Amen.

HYMN
[Suggested: "Amazing Grace," "It Is Well with My Soul," "In the Sweet By and By," "Rock of Ages."]

OLD TESTAMENT READING
{{read:Psalms 23}}
— Psalm 23

{{read:Psalms 90:1-2, 10, 12}}
— Psalm 90

NEW TESTAMENT READING
{{read:John 14:1-6}}
— John 14

OBITUARY
{{Name}} was born {{Born}} and departed this life {{Died}}.
{{Story}}

{{He}} leaves to cherish {{his}} memory:
{{Family}}

[Read the full obituary, or invite a family member to share.]

SPECIAL MUSIC OR TRIBUTES
[A song, a reading by a grandchild, or a few words from a family member.]

MESSAGE OF HOPE
[10–15 minutes. Suggested texts: John 14:1-6; 2 Corinthians 5:1-8; 1 Thessalonians 4:13-18.
 1. Honor {{First}}'s life and faith with specific memories.
 2. Speak to the grief: Jesus wept at Lazarus' tomb (John 11:35).
 3. Proclaim the hope: absent from the body, present with the Lord.
 4. Gently extend the invitation: the hope {{First}} had is offered to everyone here through Jesus Christ.]

THE LORD'S PRAYER
[Prayed together.]

PRAYER FOR THE FAMILY
O God, whose days are without end and whose mercies cannot be numbered: we thank Thee for the life of {{First}}, for every good gift Thou gavest through {{him}}, and for the love that bound this family together. Comfort those who mourn. Give them faith to look beyond this present sorrow, and hope in the resurrection of the dead, through Jesus Christ our Lord. Amen.

DISMISSAL
[Instructions for the procession to the cemetery, and any meal or gathering afterward. The family is escorted out.]

— — —

THE COMMITTAL (at the graveside)
{{read:1 Thessalonians 4:13-18}}

Forasmuch as it hath pleased Almighty God of his great mercy to take unto himself the soul of our dear {{brother}} here departed, we therefore commit {{his}} body to the ground; earth to earth, ashes to ashes, dust to dust; in sure and certain hope of the Resurrection to eternal life, through our Lord Jesus Christ; who shall change our vile body, that it may be like unto his glorious body, according to the mighty working, whereby he is able to subdue all things to himself.

I heard a voice from heaven, saying unto me, Write, From henceforth blessed are the dead which die in the Lord: even so saith the Spirit; for they rest from their labours.

BENEDICTION
Now the God of peace, that brought again from the dead our Lord Jesus, that great shepherd of the sheep, through the blood of the everlasting covenant, make you perfect in every good work to do his will. Amen.`},
{id:'f2',kind:'funeral',style:'Modern',title:'Celebration of Life',mins:'30–45 min',
 desc:'A warm, personal service centered on the person’s story and the hope of the gospel. Works for a memorial service without a casket.',
 body:`A CELEBRATION OF LIFE
{{Name}}
{{Born}} – {{Died}}
{{Place}}

[Slideshow or music as guests arrive. Family is seated.]

WELCOME
Good morning. My name is {{Officiant}}. On behalf of {{First}}'s family, thank you for being here. Your presence today says more than words can. We have come to grieve, because we loved {{him}}. But we have also come to celebrate a life, and to remember that for those who belong to Jesus, death is not the end of the story.

OPENING PRAYER
Lord, we come with full hearts: full of sorrow, full of memories and full of gratitude. Meet this family right where they are. Give us room to cry and room to laugh as we remember {{First}}. And remind us that You are close to the brokenhearted. In Jesus' name, amen.

SCRIPTURE
{{read:Ecclesiastes 3:1-8}}
— Ecclesiastes 3

{{read:Revelation 21:3-5}}
— Revelation 21

{{First}}'S STORY
[Tell the life story in your own words from the family visit. Use specific details: where {{he}} grew up, work, faith, the things {{he}} loved, sayings everyone will recognize.]
{{Story}}

{{He}} is survived by:
{{Family}}

MEMORIES AND TRIBUTES
[Invite two or three family members or friends to share, 3 minutes each. Ask them ahead of time.]
[Optional: open the floor for brief memories.]

SONG
[A favorite song of the family, or a hymn such as "How Great Thou Art" or "I'll Fly Away."]

MESSAGE: A LIFE, A LOSS AND A LIVING HOPE
[10–12 minutes. Suggested text: John 11:17-27, 35.
 1. A life worth celebrating: what {{First}} taught us.
 2. A loss worth grieving: Jesus wept. It is all right to hurt.
 3. A hope worth holding: "I am the resurrection, and the life."
 Close by gently inviting anyone without that hope to find it in Christ.]

PRAYER
Father, thank You for {{First}}. Thank You for every laugh, every lesson and every act of love. Hold this family close in the days ahead, the quiet evenings, the holidays and the empty chair. Give them Your peace, and the hope of seeing {{him}} again. In Jesus' name, amen.

CLOSING AND BLESSING
{{read:Numbers 6:24-26}}

[Announcements: procession, committal or reception details.]`},
{id:'f3',kind:'funeral',style:'Graveside',title:'Graveside Committal Service',mins:'10–15 min',
 desc:'A short, complete service for the cemetery, either after a church service or as the only service.',
 body:`GRAVESIDE SERVICE FOR {{Name}}
{{Born}} – {{Died}}

[The family is seated under the tent. Wait until everyone has gathered.]

OPENING
We gather here to lay to rest the body of {{First}}, and to commit {{him}} into the hands of a loving and merciful God.

{{read:John 11:25-26}}

PRAYER
Gracious God, You know our sorrow, and You are near to every heart here. Give this family comfort today and strength for the days ahead. In Jesus' name, amen.

SCRIPTURE
{{read:Psalms 121}}

{{read:2 Corinthians 5:1, 6-8}}

A WORD OF COMFORT
[3–5 minutes. One memory of {{First}}, and one promise: "absent from the body, and to be present with the Lord."]

COMMITTAL
Forasmuch as it hath pleased Almighty God to take unto himself the soul of our dear {{brother}}, we therefore commit {{his}} body to the ground; earth to earth, ashes to ashes, dust to dust; in sure and certain hope of the resurrection to eternal life through our Lord Jesus Christ.

[Optional: a flower placed by the family, or a handful of soil.]

THE LORD'S PRAYER

BENEDICTION
{{read:Numbers 6:24-26}}

[Greet the family. Announce any gathering afterward.]`},
{id:'f4',kind:'funeral',style:'Comfort',title:'Service of Comfort',mins:'20–30 min',
 desc:'For when the faith of the departed was not known. It honors the person, comforts the family and offers the gospel gently, without speaking for their eternity.',
 body:`A SERVICE OF COMFORT AND REMEMBRANCE
{{Name}}
{{Born}} – {{Died}}
{{Place}}

[Pastor's note: speak honestly and kindly. Commend {{First}} to the mercy and justice of God, comfort the living, and offer Christ to those who remain.]

WELCOME
We are here today because {{First}} mattered: to this family, to these friends and to God, who made {{him}} and knew {{him}} completely. We come with grief, with questions and with love.

PRAYER
O Lord, You are the God of all comfort. We bring You our sorrow and our questions. Hold this family close. Give us grace to remember well, and help each of us to find our hope in You. In Jesus' name, amen.

SCRIPTURE
{{read:Psalms 46:1-3}}

{{read:Psalms 139:1-3, 7-10}}

REMEMBERING {{Name}}
{{Story}}

{{He}} leaves behind:
{{Family}}

[Invite family memories, or read a tribute they have written.]

A WORD OF COMFORT
[8–10 minutes. Suggested texts: Psalm 34:18; Matthew 11:28-30; John 3:16.
 1. God is near to the brokenhearted.
 2. God knew {{First}} better than any of us, and He is just and merciful.
 3. Jesus invites all who are weary and heavy laden to come to Him. This hope is offered to everyone here.]

PRAYER
Father, we entrust {{First}} into Your hands, the hands of a just and merciful God. We thank You for the good we saw in {{his}} life. Comfort this family, and draw every heart here to Jesus, the only sure hope in life and in death. Amen.

COMMITTAL (if at the graveside)
We commit the body of {{First}} to the ground, earth to earth, ashes to ashes, dust to dust, and we commend {{him}} to the mercy of God, who made us and who loves the world.

BENEDICTION
{{read:2 Corinthians 13:14}}`},
{id:'f5',kind:'funeral',style:'For a Child',title:'Service for a Child',mins:'20 min',
 desc:'A gentle, brief service for the loss of a baby or a child, focused on Jesus’ love for little ones and comfort for the parents.',
 body:`IN LOVING MEMORY OF {{Name}}
{{Born}} – {{Died}}
{{Place}}

[Pastor's note: keep it brief and tender. Parents often remember very little of the service. A printed copy of the Scriptures read can be a gift to them afterward.]

WELCOME
We have come together with broken hearts. There are no words big enough for a loss like this, and we will not pretend there are. But we do not grieve alone, and we do not grieve without hope.

PRAYER
Lord Jesus, You took the little children in Your arms and blessed them. We bring {{First}} to You, and we bring these parents and this family to You. Hold them when they cannot hold themselves up. Amen.

SCRIPTURE
{{read:Mark 10:13-16}}

{{read:Isaiah 40:11}}

{{read:2 Samuel 12:22-23}}

[David, after the death of his child: "I shall go to him, but he shall not return to me."]

REMEMBERING {{First}}
{{Story}}

Lovingly remembered by:
{{Family}}

A WORD OF COMFORT
[5–7 minutes.
 1. {{First}} was known and loved by God (Psalm 139:13-16).
 2. Jesus welcomes little ones; they are safe in His arms (Mark 10:14).
 3. One day God will wipe away every tear (Revelation 21:4).
 Speak directly and gently to the parents.]

PRAYER FOR THE FAMILY
Heavenly Father, we place {{First}} into Your loving care. Comfort these parents in the empty rooms and the long nights. Surround them with people who will carry them. Give them Your peace that passes understanding, and the hope of reunion in Your presence. In Jesus' name, amen.

COMMITTAL
With love we lay to rest the body of {{First}}, trusting {{him}} to the Good Shepherd who gathers the lambs in His arms.

BENEDICTION
{{read:Revelation 21:4}}`}
];
