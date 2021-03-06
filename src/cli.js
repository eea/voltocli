#!/usr/bin/env node
'use strict'
const { prompt } = require('prompts')
const validate = require('validate-npm-package-name')
const hostedGitInfo = require('hosted-git-info')
const { add } = require('./add')
const { create } = require('./create')

const adjs = ['magic', 'historical', 'galatic', 'nerd', 'colourful', 'rainbow', 'powerful', 'perfect']
const types = ['addon', 'block', 'widget', 'view', 'config']
const getRandomText = (list) => list[Math.floor(Math.random() * Math.floor(list.length))]
const randomName = `volto-${getRandomText(adjs)}-${getRandomText(types)}`

;(async function () {
  const questions = [
    {
      type: 'select',
      name: 'action',
      message: 'Pick an action',
      choices: [
        { title: 'add', description: 'Add an existing addon to your Volto project', value: 'add' },
        { title: 'create', description: 'Create an addon in your Volto project', value: 'create' },
      ],
      initial: 0,
    },
    {
      type: 'text',
      name: 'name',
      message: (prev) => `What's ${prev === 'add' ? 'the' : 'your new'} addon name?`,
      initial: randomName,
      validate: (value) => validate(value).validForNewPackages,
    },
    {
      type: 'text',
      name: 'url',
      message: 'Insert git repository URL',
      initial: `git@github.com:collective/${randomName}.git`,
      validate: (value) => hostedGitInfo.fromUrl(value) !== null,
      format: (value) => hostedGitInfo.fromUrl(value),
    },
  ]

  const createQuestions = [
    {
      type: 'text',
      name: 'description',
      message: 'Insert a description',
      initial: 'Volto addon to build beautiful things',
    },
    {
      type: 'text',
      name: 'author',
      message: 'Insert author name',
      initial: 'collective',
    },
  ]

  const answers = await prompt(questions)

  switch (answers.action) {
    case 'add':
      add(answers)
      break

    case 'create':
      const createAnswers = await prompt(createQuestions)

      create({ ...answers, ...createAnswers })
      break
  }
})()
