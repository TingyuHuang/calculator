class CalculatorController < ApplicationController
	respond_to :json, :html

	def index
	end
	def create
		@client = Client.find_by(ip: request.remote_ip)

		if @client.nil?
			@client = Client.new
			@client.ip = request.remote_ip
			@client.last_input = String.new
		end
		@client.last_input << params[:input]

		if @client.last_input.end_with? "010-10"
			@client.last_input = String.new
			ret = "bingo!"
		else
			ret = @client.last_input
		end
		@client.save

		render :json => ret
	end
end
