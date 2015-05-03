class CalculatorController < ApplicationController
	respond_to :json, :html

	def index
		@client = Client.find_by(ip: request.remote_ip)

		if @client.nil?
			@client = Client.new
			@client.ip = request.remote_ip
		end
		@client.last_input = String.new


		@client.save
	end

	def create
		@client = Client.find_by(ip: request.remote_ip)
		ret = {}

		@client.last_input << params[:input]

		if params[:input].eql? "="
			@client.last_input = String.new
		elsif @client.last_input.end_with? "010-10"
			@client.last_input = String.new
			ret[:html] = ""
		end

		@client.save

		ret[:expression] = @client.last_input
		render :json => ret
	end
end
