const fs = require("fs");
const data = require("../data.json");
const { date } = require("../utils");

exports.index = function (req, res) {
  return res.render("members/index.njk", { members: data.members });
};

exports.create = function (req, res) {
  return res.render("members/create.njk");
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, fill all fields!");
    }
  }

  birth = Date.parse(req.body.birth);

  let id = 1;
  const lastMember = data.members[data.members.length - 1];

  if (lastMember) {
    id = lastMember.id + 1;
  }

  data.members.push({
    id,
    ...req.body,
    birth,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");

    return res.redirect(`/members/${id}`);
  });
};

exports.show = function (req, res) {
  const { id } = req.params;

  const foundMember = data.members.find(function (member) {
    return member.id == id;
  });

  if (!foundMember) {
    return res.send("Member not found");
  }

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthDayMonth,
  };

  return res.render("members/show.njk", { member });
};

exports.edit = function (req, res) {
  const { id } = req.params;

  const foundMember = data.members.find(function (member) {
    return member.id == id;
  });

  if (!foundMember) {
    return res.send("Member not found");
  }

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso,
  };

  return res.render("members/edit.njk", { member });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;

  const foundMember = data.members.find(function (member, foundIndex) {
    if (id == member.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundMember) {
    return res.send("Member not found");
  }

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  };

  data.members[index] = member;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write error!");

    return res.redirect(`/members/${id}`);
  });
};

exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredIntructors = data.members.filter(function (member) {
    return member.id != id;
  });

  data.members = filteredIntructors;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error");

    return res.redirect("/members");
  });
};
